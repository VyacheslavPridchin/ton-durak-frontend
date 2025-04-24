// main.ts
import './assets/main.css'
import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import apiService from '@/services/ApiService.ts'
import { TonConnectUIPlugin, useTonConnectModal, useTonConnectUI } from '@townsquarelabs/ui-vue'
import connector from '@/services/tonconnect.js'

const app = createApp({})

app.use(router)
app.use(TonConnectUIPlugin, { connector })

const Root = {
    setup() {
        const { open } = useTonConnectModal()
        const { tonConnectUI } = useTonConnectUI()

        // Устанавливаем фильтр кошельков — только MyTonWallet
        tonConnectUI.setOptions({
            walletsList: ['mytonwallet']
        })

        // Обработка успешного подключения
        connector.onStatusChange(async (status) => {
            try {
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

                // Монтируем приложение ТОЛЬКО после успешной авторизации
                app.mount('#app')
            } catch (error) {
                console.error('Auth failed:', error)
                // Повторно открываем модальное окно при ошибке
                await open()
            }
        })

        // Инициализация подключения
        ;(async () => {
            await connector.restoreConnection()

            if (!connector.connected) {
                await open()
            }
        })()

        return () => h(App)
    },
}

app.component('Root', Root)
