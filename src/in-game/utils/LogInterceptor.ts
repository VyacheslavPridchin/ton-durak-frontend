// interface Log {
//     type: string;
//     time: number;
//     message: string;
//     trace: string;
// }
//
// interface Ticket {
//     type: string;
//     time: number;
//     player_id: string;
//     lobby_id: string;
//     access_token: string;
//     logs: Log[];
// }
//
// class LogInterceptor extends EventTarget {
//     private static instance: LogInterceptor;
//     private logs: Log[] = [];
//     private originalConsole = {
//         log: console.log,
//         error: console.error,
//         warn: console.warn,
//     };
//     private filters: string[] = [];
//     private endpoint = '';
//     private playerId: string = '';
//     private access_token: string = '';
//     private lobbyId: string = '';
//
//     private constructor(endpoint: string, filters: string[]) {
//         super();
//         this.filters = filters;
//         this.endpoint = endpoint;
//         this.init();
//     }
//
//     public static getInstance(endpoint: string = '', filters: string[] = []): LogInterceptor {
//         if (!LogInterceptor.instance) {
//             LogInterceptor.instance = new LogInterceptor(endpoint, filters);
//         }
//         return LogInterceptor.instance;
//     }
//
//     private init() {
//         console.log = (...args) => this.captureLog('log', ...args);
//         console.error = (...args) => this.captureLog('error', ...args);
//         console.warn = (...args) => this.captureLog('warn', ...args);
//     }
//
//     private captureLog(type: string, ...args: any[]) {
//         const stackTrace = new Error().stack?.split('\n').slice(2).join('\n') || '';
//         const message = args.map(this.safeStringify).join(' ');
//
//         if (this.filters.some(filter => message.includes(filter))) {
//             return;
//         }
//
//         const log: Log = {
//             type,
//             time: Date.now(),
//             message,
//             trace: stackTrace,
//         };
//
//         this.logs.push(log);
//
//         // Уведомляем всех подписчиков о новом логе
//         this.dispatchEvent(new CustomEvent('logAdded', { detail: log }));
//
//         // Выводим в консоль оригинальные методы
//         this.originalConsole[type]?.apply(console, args);
//
//         if (type === 'error' || type === 'warn') {
//             this.sendLogs(type);
//         }
//     }
//
//     private safeStringify(arg: any): string {
//         if (typeof arg === 'object' && arg !== null) {
//             try {
//                 return JSON.stringify(arg, null, 2);
//             } catch {
//                 return '[Unserializable Object]';
//             }
//         }
//         return String(arg);
//     }
//
//     private async sendLogs(type: string) {
//         const ticket: Ticket = {
//             type,
//             time: Date.now(),
//             player_id: this.playerId,
//             lobby_id: this.lobbyId,
//             access_token: this.access_token,
//             logs: [...this.logs.slice(-20)], // получаем последние 20 элементов
//         };
//
//         // Оборачиваем в поле "error" для соответствия ErrorSchema
//         const wrappedBody = {
//             error: JSON.stringify(ticket), // Обернули ticket в поле "error"
//         };
//
//         try {
//             const response = await fetch(this.endpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(wrappedBody), // Передаём обёрнутый объект
//             });
//
//             if (!response.ok) {
//                 throw new Error(`${response} ${response.status}`);
//             }
//         } catch (error) {
//             console.log('Failed to send error log:', this.endpoint, error, JSON.stringify(wrappedBody));
//         }
//     }
//
//     public getLogs(): Log[] {
//         return this.logs;
//     }
//
//     public setPlayerContext(player_id: string, lobby_id: string, access_token: string) {
//         this.playerId = player_id;
//         this.access_token = access_token;
//         this.lobbyId = lobby_id;
//     }
// }
//
// export default LogInterceptor;
