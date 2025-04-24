// main.ts
import './assets/main.css'
import {createApp, h} from 'vue'
import App from './App.vue'
import router from './router'
import apiService from '@/services/ApiService.ts'
import {TonConnectUIPlugin, useTonConnectUI} from '@townsquarelabs/ui-vue'
import connector from '@/services/tonconnect.js'

const Root = {
    setup() {
        const { tonConnectUI } = useTonConnectUI()

        // Фильтрим доступные кошельки — только MyTonWallet
        const walletFilter = (w: { name: string }) => w.name === 'MyTonWallet'

        // Рекурсивно открываем модалку, пока не подключатся
        const promptConnect = async (): Promise<void> => {
            console.log('Connecting to TonConnectUI')
            try {
                await tonConnectUI.connect({ filter: walletFilter })
            } catch {
                await promptConnect()
            }
        }

        // Обработка успешного подключения
        connector.onStatusChange(async (status) => {
            const proofItem = status.connectItems.tonProof
            const proof = 'proof' in proofItem ? proofItem.proof : ''

            const payload = {
                tonProof: proof,
                public_key: status.account.publicKey,
                state_init: status.account.walletStateInit,
                wallet_address: status.account.address,
            }

            const authResp = await apiService.authTonkeeper(payload)
            window.onBoardingRequired = authResp.data.user_data.first_time

            app.mount('#app')
        })

        // При монтировании: пробуем восстановить, иначе открываем модалку
        ;(async () => {
            await connector.restoreConnection()
            if (!connector.connected) {
                await promptConnect()
            }
        })()

        return () => h(App)
    },
}

const app = createApp(Root)
app.use(router)
// передаём фильтр кошельков в плагин
app.use(TonConnectUIPlugin, {
    connector
})

