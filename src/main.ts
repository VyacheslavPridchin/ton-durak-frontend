// main.ts
import './assets/main.css'
import { createApp, h } from 'vue'
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

        const { open } = useTonConnectModal()
        console.log('🗳️ useTonConnectModal obtained')

        const { tonConnectUI } = useTonConnectUI()
        console.log('⚙️ useTonConnectUI obtained:', tonConnectUI)

        // Устанавливаем фильтр кошельков — только MyTonWallet
        console.log('💡 Setting wallet filter option')
        tonConnectUI.setOptions({
            walletsList: ['mytonwallet']
        })

        // Обработка успешного подключения
        connector.onStatusChange(async (status) => {
            console.log('📶 onStatusChange triggered with status:', status)
            try {
                const proofItem = status.connectItems.tonProof
                const proof = 'proof' in proofItem ? proofItem.proof : ''
                console.log('🔐 Proof extracted:', proof)

                const payload = {
                    tonProof: proof,
                    public_key: status.account.publicKey,
                    state_init: status.account.walletStateInit,
                    wallet_address: status.account.address,
                }
                console.log('📤 Sending auth payload:', payload)

                const authResp = await apiService.authTonkeeper(payload)
                console.log('✅ authTonkeeper response:', authResp)

                window.onBoardingRequired = authResp.data.user_data.first_time
                console.log('🏷️ onBoardingRequired set to', window.onBoardingRequired)

                console.log('🎉 Mounting app now')
                app.mount('#app')
            } catch (error) {
                console.error('❌ Auth or mount failed:', error)
                console.log('🔄 Re-opening modal')
                await open()
            }
        })

        // Инициализация подключения
        ;(async () => {
            console.log('⏳ Restoring connection...')
            await connector.restoreConnection()
            console.log('🔄 restoreConnection() returned, connected =', connector.connected)

            if (!connector.connected) {
                console.log('🔔 Not connected, opening modal')
                await open()
            } else {
                console.log('🔔 Already connected, waiting for onStatusChange')
            }
        })()

        console.log('🔧 Root.setup() end')
        return () => h(App)
    },
}

app.component('Root', Root)
console.log('📝 Root component registered')

// Замечание: `app.mount('#app')` вызывается только после onStatusChange
