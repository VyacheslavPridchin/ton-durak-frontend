// main.ts
import './assets/main.css'
import { createApp, defineComponent, h, ref, watch } from 'vue'
import App from './App.vue'
import router from './router'
import apiService from '@/services/ApiService.ts'
import { TonConnectUIPlugin, useTonConnectModal, useTonConnectUI } from '@townsquarelabs/ui-vue'
import connector from '@/services/tonconnect.js'

console.log('🏁 main.ts start')

const Root = defineComponent({
    name: 'Root',
    setup() {
        console.log('🔧 Root.setup start')

        const { state, open } = useTonConnectModal()
        console.log('🗳 useTonConnectModal obtained')

        const { tonConnectUI } = useTonConnectUI()
        console.log('⚙ useTonConnectUI obtained')

        // Оставляем в списке только MyTonWallet
        tonConnectUI.setOptions({ walletsList: ['mytonwallet'] })
        console.log('💡 Wallet filter applied')

        // Флаг, что авторизация пройдена
        const authorized = ref(false)

        // Если модалка закрылась без подключения — откроем заново
        watch(
            () => state.value.status,
            async (status) => {
                console.log('🎯 Modal status:', status)
                if (status === 'closed' && !connector.connected) {
                    console.log('🔄 Modal closed without connection, reopening')
                    await open()
                }
            }
        )

        // При любом изменении статуса коннектора
        connector.onStatusChange(async (status) => {
            console.log('📶 onStatusChange:', status)
            const proofItem = status.connectItems.tonProof
            const proof = 'proof' in proofItem ? proofItem.proof : ''
            console.log('🔐 Proof:', proof)

            const payload = {
                tonProof: proof,
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

                // Разрешаем отрисовку основного приложения
                authorized.value = true
            } catch (err) {
                console.error('❌ Auth failed, reopening modal:', err)
                await open()
            }
        })

        // Сразу восстанавливаем сессию или открываем модалку
        ;(async () => {
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

        console.log('🔧 Root.setup end')

        // В рендере: пока не авторизованы — ничего не показываем,
        // когда `authorized === true` — рисуем <App/>
        return () => {
            if (!authorized.value) return null
            return h(App)
        }
    }
})

const app = createApp(Root)
app.use(router)
app.use(TonConnectUIPlugin, { connector })
console.log('🚀 Plugins applied, mounting Root')
app.mount('#app')
