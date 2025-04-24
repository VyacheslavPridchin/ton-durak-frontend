// main.ts
import './assets/main.css'
import { createApp, h, watch } from 'vue'
import App from './App.vue'
import router from './router'
import apiService from '@/services/ApiService.ts'
import { TonConnectUIPlugin, useTonConnectModal, useTonConnectUI } from '@townsquarelabs/ui-vue'
import connector from '@/services/tonconnect.js'

console.log('🏁 main.ts start')

const app = createApp({})

app.use(router)
app.use(TonConnectUIPlugin, { connector })
console.log('🚀 Plugins applied')

const Root = {
    setup() {
        console.log('🔧 Root.setup() start')

        const { state, open, close } = useTonConnectModal()
        console.log('🗳️ useTonConnectModal obtained')

        const { tonConnectUI } = useTonConnectUI()
        console.log('⚙️ useTonConnectUI obtained')

        // Фильтруем кошельки (только MyTonWallet)
        tonConnectUI.setOptions({
            walletsList: ['mytonwallet'],
        })
        console.log('💡 Wallet filter applied')

        // Если модалка закрылась без подключения, откроем её снова
        watch(
            () => state.value.status,
            async (status) => {
                console.log('🎯 Modal status changed →', status)
                if (status === 'closed' && !connector.connected) {
                    console.log('🔄 Modal closed but not connected → reopening')
                    await open()
                }
            }
        )

        // Когда статус коннектора меняется (успешное подключение) — монтируем приложение
        connector.onStatusChange(async (status) => {
            console.log('📶 onStatusChange:', status)
            const proofItem = status.connectItems.tonProof
            const proof = 'proof' in proofItem ? proofItem.proof : ''
            console.log('🔐 Extracted proof:', proof)

            const payload = {
                tonProof: proof,
                public_key: status.account.publicKey,
                state_init: status.account.walletStateInit,
                wallet_address: status.account.address,
            }
            console.log('📤 Sending auth payload:', payload)

            try {
                const authResp = await apiService.authTonkeeper(payload)
                console.log('✅ authTonkeeper response:', authResp)
                window.onBoardingRequired = authResp.data.user_data.first_time
                console.log('🎉 Mounting app now')
                app.mount('#app')
            } catch (err) {
                console.error('❌ Auth failed, reopening modal:', err)
                await open()
            }
        })

        // Начальная попытка восстановить сессию или открыть модалку
        ;(async () => {
            console.log('⏳ Restoring connection…')
            await connector.restoreConnection()
            console.log('🔄 connector.connected =', connector.connected)

            if (connector.connected) {
                console.log('🔔 Already connected → mounting')
                app.mount('#app')
            } else {
                console.log('🔔 Not connected → opening modal')
                await open()
            }
        })()

        console.log('🔧 Root.setup() end')
        return () => h(App)
    },
}

app.component('Root', Root)
console.log('📝 Root component registered')
// Заметьте: app.mount('#app') больше не вызывается здесь — только внутри onStatusChange или после restoreConnection.
