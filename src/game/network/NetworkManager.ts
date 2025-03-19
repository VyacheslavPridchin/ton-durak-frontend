import { NetworkPacketProcessor } from "./NetworkPacketProcessor";
import {JoinRequest, LeaveRequest, PingRequest} from "./RequestPackets";
import PlayerSettingsStorage from "./PlayerSettingsStorage";
// import userService from "../../services/user.service";
// import TokenService from "../../services/token.service";
import { EventService, EventType } from "./EventService.ts";
import ApiService from "@/services/ApiService.ts";
import apiService from "@/services/ApiService.ts";

class NetworkManager {
    private static _instance: NetworkManager | null = null;
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 100;
    private reconnectDelay = 1000; // 1 seconds
    private url: string = ''; // WebSocket server URL
    private heartbeatInterval: number = 1000; // 1.5 seconds
    private pongTimeout: number = 4000; // 10 seconds
    private heartbeatTimer: any = null;
    private pongTimer: any = null;

    reconnectionRequired: boolean = true;
    surrendered: boolean = false;

    public static get Instance(): NetworkManager {
        if (!this._instance) {
            this._instance = new NetworkManager();
        }
        return this._instance;
    }

    private constructor() {}

    /**
     * Set WebSocket server URL
     */
    public setUrl(url: string): void {
        this.url = url;
    }

    /**
     * Connect to the WebSocket server
     */
    public connect(): void {
        if (!this.url) {
            console.error('WebSocket URL is not set.');
            return;
        }

        if (this.socket) {
            console.log('Closing existing WebSocket connection.');
            this.reconnectionRequired = false;
            this.close();
        }

        this.surrendered = false;
        this.reconnectionRequired = true;

        console.log(`Connecting to WebSocket server: ${this.url}`);
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('Connection established.');
            this.reconnectAttempts = 0; // Reset reconnection attempts
            this.handleConnect().then(r => this.startHeartbeat());
        };

        this.socket.onmessage = (event) => {
            console.log('Message received:', event.data);
            this.handleMessage(event.data);
        };

        this.socket.onclose = (event) => {
            console.log('Connection closed:', event.reason);
            this.handleDisconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    /**
     * Start periodic ping messages and expect pong responses
     */
    private startHeartbeat(): void {
        this.heartbeatTimer = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const request = new PingRequest();
                this.send(request);
                console.log('Ping sent.');
            }
        }, this.heartbeatInterval);

        this.startPongTimeout();
    }

    /**
     * Stop periodic ping messages
     */
    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        this.stopPongTimeout();
    }

    /**
     * Reset pong timeout on receiving any message
     */
    private resetPongTimeout(): void {
        this.stopPongTimeout(); // Clear the existing pong timeout
        this.startPongTimeout(); // Start a new pong timeout
    }

    /**
     * Start timer for pong timeout
     */
    private startPongTimeout(): void {
        this.stopPongTimeout(); // Ensure no overlapping timeouts
        this.pongTimer = setTimeout(() => {
            console.warn('Pong timeout: No packets received in time. Reconnecting...');
            this.handleDisconnect(); // Trigger reconnection logic
        }, this.pongTimeout);
    }

    /**
     * Stop pong timeout timer
     */
    private stopPongTimeout(): void {
        if (this.pongTimer) {
            clearTimeout(this.pongTimer);
            this.pongTimer = null;
        }
    }

    /**
     * Handle successful connection
     */
    private async handleConnect(): Promise<void> {
        await this.RefreshTokens();

        const token = ApiService.accessToken;
        const lobbyId = PlayerSettingsStorage.lobbyId;

        EventService.Instance.emit(EventType.Reconnect, false);

        if (token && lobbyId) {
            const joinRequest = new JoinRequest(lobbyId, token);
            this.send(joinRequest);
        } else {
            console.error("token or lobbyId is missing, join request not sent.");
        }
    }

    /**
     * Handle incoming messages
     */
    private handleMessage(data: string): void {
        try {
            const parsedData = JSON.parse(data);

            // Reset pong timeout for any received message
            this.resetPongTimeout();

            // Process other messages
            NetworkPacketProcessor.processPacket(data);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    /**
     * Handle connection loss
     */
    private handleDisconnect(): void {
        this.stopHeartbeat();

        console.log("reconnectionRequired", this.reconnectionRequired);
        if (this.reconnectionRequired) {
            EventService.Instance.emit(EventType.Reconnect, true);
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                console.warn(`Reconnection attempt (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect();
                }, this.reconnectDelay);
            } else {
                console.error('Maximum reconnection attempts exceeded.');
            }
        }
    }

    public async RefreshTokens(): Promise<void> {
        try {
            const refreshToken = ApiService.refreshToken;
            if (!refreshToken) {
                console.error("Refresh токен недоступен!");
                return;
            }

            await apiService.refreshTokens();

            //
            // const response = await fetch('https://tondurakgame.com/refresh', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${refreshToken}`
            //     }
            // });
            //
            // if (!response.ok) {
            //     console.error("Failed to refresh token");
            //     return;
            // }
            //
            // const data = await response.json();
            // if (data.accessToken && data.refreshToken) {
            //     EventService.Instance.emit(EventType.JwtSet, data.accessToken);
            //     EventService.Instance.emit(EventType.RefreshTokenSet, data.refreshToken);
            // }
        } catch (error) {
            console.error("Error refreshing token:", error);
        }
    }

    /**
     * Send a message to the server
     */
    public send(data: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
            console.log('Message sent:', JSON.stringify(data));
        } else {
            console.log('Unable to send message. Connection is not established.');
        }
    }

    /**
     * Close WebSocket connection
     */
    public close(): void {
        if (this.socket) {
            // Remove all event handlers
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onclose = null;
            this.socket.onerror = null;

            // Close the connection
            this.socket.close();
            console.log('Connection closed manually.');

            // Clear the socket reference
            this.socket = null;
        }

        this.stopHeartbeat();
    }

    public leave(): void {
        this.reconnectionRequired = false;

        const request = new LeaveRequest();
        this.send(request);
    }

    public CloseGame(router: any, silentExit: boolean = false): void {
        this.reconnectionRequired = false;

        if(!silentExit) {
            this.leave();
        }

        this.close();
        router.push('/');
        // userService.postCheckToTournament().then(response => {
        //     if (response.data.first_time) {
        //         userService.postEvent('tournament_seen').then(() => {});
        //         router.push('/tournament');
        //     } else {
        //         router.push('/game');
        //     }
        // });
    }
}

// Export Singleton
export default NetworkManager.Instance;