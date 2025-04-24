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
        console.log('🔧 Root.setup start')

        const { state, open } = useTonConnectModal()
        const { tonConnectUI, setOptions } = useTonConnectUI()
        const authorized = ref(false)

        ;(async () => {
            console.log('⏳ Loading wallets…')
            const walletsList = await tonConnectUI.getWallets()
            console.log('📦 All wallets:', walletsList)

            const filtered = walletsList.filter(w => w.name === 'MyTonWallet')
            console.log('🔍 Filtered wallets:', filtered)

            // теперь используем setOptions, а не tonConnectUI.setOptions
            setOptions({
                walletsListConfiguration: { includeWallets: filtered }
            })
            console.log('✅ Wallet filter applied')

            console.log('⏳ Restoring connection…')
            await connector.restoreConnection()
            console.log('🔄 connector.connected =', connector.connected)

            if (!connector.connected) {
                console.log('🔔 Not connected → opening modal')
                await open()
            } else {
                console.log('✔ Already connected → waiting onStatusChange')
            }
        })()

        watch(
            () => state.value.status,
            async status => {
                console.log('🎯 Modal status:', status)
                if (status === 'closed' && !connector.connected) {
                    console.log('🔄 Modal closed without connection → reopening')
                    await open()
                }
            }
        )

        connector.onStatusChange(async status => {
            console.log('📶 onStatusChange:', status)
            const proofItem = status.connectItems?.tonProof
            const proof = proofItem && 'proof' in proofItem ? proofItem.proof : ''
            console.log('🔐 Proof:', proof)

            const payload = {
                proof: { tonProof: "12345678" },
                public_key: status.account.publicKey,
                state_init: status.account.walletStateInit,
                wallet_address: status.account.address,
            }
            console.log('📤 Auth payload:', payload)

            try {
                const authResp = await apiService.authTonkeeper(payload)
                console.log('✅ authTonkeeper response:', authResp)
                window.onBoardingRequired = authResp.data.user_data.first_time
                console.log('🏷 onBoardingRequired:', window.onBoardingRequired)

                authorized.value = true
            } catch (err) {
                console.error('❌ Auth failed, reopening modal:', err)
                await open()
            }
        })

        console.log('🔧 Root.setup end')

        return () => (authorized.value ? h(App) : null)
    }
})

console.log('🏁 main.ts start')
const app = createApp(Root)
app.use(router)
app.use(TonConnectUIPlugin, { connector })
console.log('🚀 Plugins applied, mounting Root')
app.mount('#app')
