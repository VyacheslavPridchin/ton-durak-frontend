// main.ts
import './assets/main.css'
import { createApp, defineComponent, h, ref, watch } from 'vue'
import App from './App.vue'
import router from './router'
import apiService from '@/services/ApiService.ts'
import { TonConnectUIPlugin, useTonConnectModal, useTonConnectUI } from '@townsquarelabs/ui-vue'
import connector from '@/services/tonconnect.js'

const Root = defineComponent({
    name: 'Root',
    setup() {
        // 1. Modal control hooks
        const { state, open } = useTonConnectModal()                    // open() opens the connect modal :contentReference[oaicite:4]{index=4}
        const { tonConnectUI, setOptions } = useTonConnectUI()         // access TonConnectUI instance and UI options :contentReference[oaicite:5]{index=5}

        // 2. Auth flag to render App only after success
        const authorized = ref(false)

            // 3. Filter wallets to only MyTonWallet
        ;(async () => {
            const walletsList = await tonConnectUI.getWallets()           // load all wallets :contentReference[oaicite:6]{index=6}
            const filtered = walletsList.filter(w => w.name === 'MyTonWallet')
            setOptions({
                walletsListConfiguration: { includeWallets: filtered }
            })                                                            // apply filter :contentReference[oaicite:7]{index=7}

            // 4. Try to restore existing session; if none, prompt connect
            await connector.restoreConnection()
            if (!connector.connected) {
                await promptConnect()
            }
        })()

        // 5. Prepare and open modal with tonProof
        const promptConnect = async () => {
            // a) Fetch or generate your proof here (static for example)
            const proof = '12345678'
            // b) Inject proof into the upcoming connect request
            tonConnectUI.setConnectRequestParameters({
                state: 'ready',
                value: { tonProof: proof }
            })                                                              // inject tonProof :contentReference[oaicite:8]{index=8}
            // c) Open the wallets modal
            await open()
        }

        // 6. Re-open modal automatically if user closes it without connecting
        watch(
            () => state.value.status,
            async status => {
                if (status === 'closed' && !connector.connected) {
                    await promptConnect()
                }
            }
        )

        // 7. Handle successful connection → authenticate → render App
        connector.onStatusChange(async wallet => {
            // @ts-ignore
            const proof = wallet.connectItems?.tonProof?.proof

            if(proof == undefined || proof == ""){
                await promptConnect();
                return;
            }

            const payload = {
                tonProof: proof,
                public_key: wallet.account.publicKey,
                state_init: wallet.account.walletStateInit,
                wallet_address: wallet.account.address,
            }
            try {
                const authResp = await apiService.authTonkeeper(payload)
                window.onBoardingRequired = authResp.data.user_data.first_time
                authorized.value = true                                      // only now render <App/>
            } catch {
                await promptConnect()                                         // retry on auth failure
            }
        })

        // 8. Only render the main App after authorization
        return () => (authorized.value ? h(App) : null)
    }
})

const app = createApp(Root)
app.use(router)
app.use(TonConnectUIPlugin, { connector })
app.mount('#app')
