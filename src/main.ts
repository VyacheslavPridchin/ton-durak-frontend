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
        const { state } = useTonConnectModal()
        const { tonConnectUI } = useTonConnectUI()
        const authorized = ref(false)

        // Подписываемся на статус соединения
        connector.onStatusChange(async status => {
            console.log('📶 onStatusChange:', status)
            const proofItem = status.connectItems.tonProof
            const proof = proofItem && 'proof' in proofItem ? proofItem.proof : ''
            console.log('🔐 Proof received:', proof)

            const payload = {
                tonProof: proof,
                public_key: status.account.publicKey,
                state_init: status.account.walletStateInit,
                wallet_address: status.account.address,
            }

            try {
                const authResp = await apiService.authTonkeeper(payload)
                console.log('✅ authTonkeeper response:', authResp)
                window.onBoardingRequired = authResp.data.user_data.first_time
                authorized.value = true
            } catch (err) {
                console.error('❌ Auth failed, reopening modal:', err)
                // если что-то пошло не так — откроем заново
                await promptConnect()
            }
        })

        // Функция открытия с передачей фильтра и tonProof
        const promptConnect = async () => {
                console.log('👉 Opening TonConnect modal with proof…')
                try {
                    await tonConnectUI.connect({
                        filter: w => w.name === 'MyTonWallet',
                        request: { tonProof: '12345678' }
                    })
                } catch (err) {
                    console.error('❌ connect() failed, retrying:', err)
                    await promptConnect()
                }
            }

            // Сразу пытаемся восстановить сессию, иначе открываем модалку
        ;(async () => {
            console.log('⏳ Restoring connection…')
            await connector.restoreConnection()
            console.log('🔄 connector.connected =', connector.connected)

            if (!connector.connected) {
                console.log('🔔 Not connected → promptConnect()')
                await promptConnect()
            } else {
                console.log('✔ Already connected → waiting onStatusChange')
            }
        })()

        // Если модалка закрылась без соединения, откроем снова
        watch(() => state.value.status, async status => {
            console.log('🎯 Modal status:', status)
            if (status === 'closed' && !connector.connected) {
                console.log('🔄 Modal closed without connection → reopening')
                await promptConnect()
            }
        })

        // Рендерим <App/> только после успешной авторизации
        return () => (authorized.value ? h(App) : null)
    }
})

console.log('🏁 main.ts start')
const app = createApp(Root)
app.use(router)
app.use(TonConnectUIPlugin, { connector })
console.log('🚀 Plugins applied, mounting Root')
app.mount('#app')
