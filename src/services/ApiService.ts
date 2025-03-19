import axios from "axios";
import type { AxiosResponse, AxiosInstance } from "axios";

// Стандартный интерфейс ответа API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error: string | null;
}

// Интерфейсы для auth
export interface AuthRequest {
    initData: string;
}

export interface AuthResponseData {
    technical: boolean;
    user_data: {
        jwt: {
            access_token: string;
            refresh_token: string;
        };
        first_timer: boolean;
    };
}

export interface RefreshResponseData {
    accessToken: string;
    refreshToken: string;
}

// Интерфейсы для GET запросов
export interface ScreenMainData {
    league: {
        rank: string;
        division: number;
        progress: number;
    };
    tournament: {
        place: number;
        prize_pool: number;
        deadline: number;
    };
    finance: {
        balance: number;
        bonus_balance: number;
    };
}

export interface ScreenReferralData {
    overview: {
        link: string;
        unclaimed: number;
        claimed: number;
        referrals: number;
    };
    top_referrals: {
        referrals: Array<{
            place: number;
            user_id: number;
            amount: number;
            name: string;
        }>;
    };
}

export interface ScreenReferralGraphData {
    graph: Array<{
        index: number;
        day: string;
        amount: number;
    }>;
}

export interface ScreenTournamentData {
    league: {
        rank: string;
        division: number;
        progress: number;
    };
    tournament: {
        place: number;
        prize_pool: number;
        deadline: number;
    };
    players: Array<{
        place: number;
        user_id: number;
        name: string;
        wins: number;
        prize: number;
    }>;
}

export interface ScreenProfileData {
    name: string;
    stats: Array<{
        stat_name: string;
        value: string;
    }>;
}

export interface ScreenFinanceData {
    balance: number;
    bonus_balance: number;
}

export interface ScreenFinanceTransactionsData {
    transactions: Array<{
        tx_type: string;
        amount: number;
        ts: number;
    }>;
}

export interface ScreenReferralTransactionsData {
    transactions: Array<{
        tx_type: string;
        amount: number;
        ts: number;
    }>;
}

export interface ProfileEditData {
    name_timer: number;
    photo_timer: number;
}


export interface DepositInfoData {
    price: number;
    minAmount: number;
    fee: number;
    address: string;
}

export interface WithdrawalInfoData {
    balance: number;
    minAmount: number;
    fee: number;
    address: string;
    price: string;
}

// Класс для работы с API как синглтон-сервис с кэшированием токенов
class ApiService {
    private axiosInstance: AxiosInstance;
    public accessToken: string | null = null;
    public refreshToken: string | null = null;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "https://test.api.tondurakgame.com",
            headers: {
                "Content-Type": "application/json",
            },
        });
        this.loadTokensFromCache();
    }

    // Загружаем токены из localStorage
    private loadTokensFromCache(): void {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");
        if (storedAccess && storedRefresh) {
            this.accessToken = storedAccess;
            this.refreshToken = storedRefresh;
        }
    }

    // Сохраняем токены в localStorage
    private saveTokensToCache(): void {
        if (this.accessToken && this.refreshToken) {
            localStorage.setItem("accessToken", this.accessToken);
            localStorage.setItem("refreshToken", this.refreshToken);
        }
    }

    // Универсальный метод запроса с обработкой и оборачиванием ответа в стандартный формат
    private async request<T>(
        endpoint: string,
        method: "GET" | "POST" | "PUT" = "GET",
        payload?: any,
        extraHeaders?: Record<string, string>,
        retry: boolean = true,  // флаг повторной попытки
        useRefreshToken: boolean = false,
    ): Promise<ApiResponse<T>> {
        const headers = {
            ...this.axiosInstance.defaults.headers.common,
            ...(this.accessToken ? { Authorization: `Bearer ${useRefreshToken ? this.refreshToken : this.accessToken}` } : {}),
            ...extraHeaders,
        };

        console.log(
            `Requesting [${method}] '/${endpoint}' with body ${payload ? JSON.stringify(payload) : "{}"}`
        );

        const response: AxiosResponse = await this.axiosInstance.request({
            url: endpoint,
            method,
            data: payload,
            headers,
        });

        if (response.status !== 200) {
            throw new Error("Произошла ошибка при выполнении запроса!");
        }

        let apiResponse = this.handleResponse<T>(response.data);

        // Если токен истек и это первая попытка, обновляем токены и повторяем запрос
        if (!apiResponse.success && apiResponse.error === "jwt_expired" && retry) {
            await this.refreshTokens();
            return this.request<T>(endpoint, method, payload, extraHeaders, false);
        }

        return apiResponse;
    }

    public async refreshTokens(): Promise<void> {
        const refreshResponse = await this.postRefreshTokens();
        if (refreshResponse.success) {
            this.accessToken = refreshResponse.data.accessToken;
            this.refreshToken = refreshResponse.data.refreshToken;
            this.saveTokensToCache();
        }
    }

    // Обработчик, обеспечивающий соответствие результата стандартному формату
    private handleResponse<T>(response: any): ApiResponse<T> {
        if (
            response &&
            typeof response.success === "boolean" &&
            "data" in response &&
            "error" in response
        ) {
            return response as ApiResponse<T>;
        }
        return { success: true, data: response as T, error: null };
    }

    // auth: POST /full_auth
    public async auth(payload: AuthRequest): Promise<ApiResponse<AuthResponseData>> {
        const response = await this.request<AuthResponseData>("full_auth", "POST", payload);
        if (response.success && response.data?.user_data?.jwt) {
            this.accessToken = response.data.user_data.jwt.access_token;
            this.refreshToken = response.data.user_data.jwt.refresh_token;

            console.log(this.refreshToken);

            this.saveTokensToCache();
        }
        return response;
    }

    // GET /screen/main
    public async getScreenMain(): Promise<ApiResponse<ScreenMainData>> {
        return this.request<ScreenMainData>("/screen/main", "GET");
    }

    // GET /screen/referral
    public async getScreenReferral(): Promise<ApiResponse<ScreenReferralData>> {
        return this.request<ScreenReferralData>("/screen/referral", "GET");
    }

    // GET /screen/referral/graph
    public async getScreenReferralGraph(): Promise<ApiResponse<ScreenReferralGraphData>> {
        return this.request<ScreenReferralGraphData>("/screen/referral/graph", "GET");
    }

    // GET /screen/tournament
    public async getScreenTournament(): Promise<ApiResponse<ScreenTournamentData>> {
        return this.request<ScreenTournamentData>("/screen/tournament", "GET");
    }

    // GET /screen/profile
    public async getScreenProfile(): Promise<ApiResponse<ScreenProfileData>> {
        return this.request<ScreenProfileData>("/screen/profile", "GET");
    }

    // GET /screen/finance
    public async getScreenFinance(): Promise<ApiResponse<ScreenFinanceData>> {
        return this.request<ScreenFinanceData>("/screen/finance", "GET");
    }

    // GET /screen/finance/transactions
    public async getScreenFinanceTransactions(): Promise<ApiResponse<ScreenFinanceTransactionsData>> {
        return this.request<ScreenFinanceTransactionsData>("/screen/finance/transactions", "GET");
    }

    // GET /screen/referral/transactions
    public async getScreenReferralTransactions(): Promise<ApiResponse<ScreenReferralTransactionsData>> {
        return this.request<ScreenReferralTransactionsData>("/screen/referral/transactions", "GET");
    }

    // GET /screen/profile/edit
    public async getProfileEditTimers(): Promise<ApiResponse<ProfileEditData>> {
        return this.request<ProfileEditData>("/screen/profile/edit", "GET");
    }

    // GET /deposit_info/{type}
    public async getDepositInfo(type: string): Promise<ApiResponse<DepositInfoData>> {
        return this.request<DepositInfoData>(`/deposit_info/${type}`, "GET");
    }

    // GET /withdrawal_info/{type}
    public async getWithdrawalInfo(type: string): Promise<ApiResponse<WithdrawalInfoData>> {
        return this.request<WithdrawalInfoData>(`/withdrawal_info/${type}`, "GET");
    }

    // PUT /screen/profile/edit - изменение профиля (например, смена имени или загрузка фото)
    public async updateProfileEdit(name: string | undefined, file: File | Blob | undefined | null): Promise<ApiResponse<null>> {
        if(file !== undefined && file !== null) {
            const formData = new FormData();
            formData.append("fileToUpload", file);

            let endpoint = `/screen/profile/edit`;

            // Имя передаётся в query string
            if(name !== undefined)
            {
                endpoint = `/screen/profile/edit?name=${encodeURIComponent(name)}`;
            }

            return this.request<null>(endpoint, "PUT", formData);
        } else {
            if(name === undefined) throw new Error("Имя не указано!");

            const endpoint = `/screen/profile/edit?name=${encodeURIComponent(name)}`;
            return this.request<null>(endpoint, "PUT");
        }
    }

    // POST /withdraw
    public async withdraw(data: any): Promise<ApiResponse<any>> {
        const endpoint = `/withdraw`;
        return this.request<any>(endpoint, "POST", data);
    }

    // POST /users/claim
    public async claimReferral(): Promise<ApiResponse<any>> {
        const endpoint = `/users/claim`;
        return this.request<any>(endpoint, "POST");
    }

    // POST /refresh
    public async postRefreshTokens(): Promise<ApiResponse<RefreshResponseData>> {
        const endpoint = `/refresh`;
        // Передаем retry=false, чтобы избежать рекурсии в случае неудачи
        return this.request<RefreshResponseData>(endpoint, "POST", undefined, undefined, false, true);
    }

    // POST /quickgame
    public async quickGame(bids: number[], playerAmounts: string[], gameTypes: string[]): Promise<ApiResponse<any>> {
        const endpoint = `/quickgame`;
        const payload = {
            bids,
            player_amounts: playerAmounts,
            game_types: gameTypes,
        };

        return this.request<any>(endpoint, "POST", payload);
    }

    // POST /update_address
    public async postUpdateAddress(address: string, code: string): Promise<ApiResponse<WithdrawalInfoData>> {
        const endpoint = `/update_address`;

        const payload = {
            address: address,
            code: code,
        };

        // Передаем retry=false, чтобы избежать рекурсии в случае неудачи
        return this.request<WithdrawalInfoData>(endpoint, "POST", payload, undefined, false, true);
    }

}

const apiService = new ApiService();
export default apiService;
