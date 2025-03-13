// apiService.ts
import axios from "axios";
import type { AxiosResponse, AxiosInstance } from "axios";

// Интерфейсы запросов и ответов

// auth (POST)
export interface AuthRequest {
    initData: string;
}

export interface AuthResponse {
    exist: boolean;
    technical: boolean;
    user_data: {
        jwt: {
            access_token: string;
            refresh_token: string;
        };
        first_timer: boolean;
    };
}

// main (GET)
export interface MainResponse {
    league: {
        rank: string;
        division: number;
        progress: number; // 0-100%
    };
    tournament: {
        place: number;
        amount: number;
        deadline: number; // unix time
    };
    finance: {
        balance: number;
        bonus: number;
    };
}

// tournament (GET)
export interface TournamentPlayer {
    place: number;
    user_id: number;
    name: string;
    wins: number;
    prize: number;
}

export interface TournamentResponse {
    league: {
        rank: string;
        division: number;
        progress: number;
    };
    tournament: {
        amount: number;
        deadline: number;
    };
    players: TournamentPlayer[];
}

// ranks (GET)
export type RanksResponse = string[];

// referral (GET)
export interface ReferralTop {
    place: number;
    user_id: number;
    amount: number;
}

export interface ReferralResponse {
    link: string;
    overview: {
        toClaim: number;
        referrals: number;
        claimed: number;
    };
    top: ReferralTop[];
}

// referrals_extra_info (GET)
export interface ReferralOverviewItem {
    day: string; // пн, вт и т.д.
    amount: number;
}

export interface ReferralTransaction {
    type: string; // referral
    amount: number;
    ts: number; // unix time
}

export interface ReferralsExtraInfoResponse {
    overview: ReferralOverviewItem[];
    transactions: ReferralTransaction[];
}

// profile (GET)
export interface ProfileStat {
    stat: string;
    value: string;
}

export interface ProfileOverview {
    name: string;
    stats: ProfileStat[];
}

export interface ProfileResponse {
    overview: ProfileOverview;
}

// profile_change_name (GET)
export interface ProfileChangeNameResponse {
    name_timer: number;
    photo_timer: number;
}

// Класс для работы с API, реализованный как синглтон-сервис
class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "https://test.api.tondurakgame.com",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Универсальный метод запроса
    private async request<T>(
        endpoint: string,
        method: "GET" | "POST" = "GET",
        payload?: any
    ): Promise<T> {
        try {
            console.log(`Try to request [${method}] ${endpoint} with body ${JSON.stringify(payload)}`);
            const response = await this.axiosInstance.request<T>({
                url: endpoint,
                method,
                data: payload,
            });
            return response.data;
        } catch (error) {
            // Можно расширить обработку ошибок при необходимости
            throw error;
        }
    }

    // auth: POST /full_auth
    public async auth(payload: AuthRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>("full_auth", "POST", payload);
    }

    // main: GET /main
    public async getMain(): Promise<MainResponse> {
        return this.request<MainResponse>("main");
    }

    // tournament: GET /tournament
    public async getTournament(): Promise<TournamentResponse> {
        return this.request<TournamentResponse>("tournament");
    }

    // ranks: GET /ranks
    public async getRanks(): Promise<RanksResponse> {
        return this.request<RanksResponse>("ranks");
    }

    // referral: GET /referral
    public async getReferral(): Promise<ReferralResponse> {
        return this.request<ReferralResponse>("referral");
    }

    // referrals_extra_info: GET /referrals_extra_info
    public async getReferralsExtraInfo(): Promise<ReferralsExtraInfoResponse> {
        return this.request<ReferralsExtraInfoResponse>("referrals_extra_info");
    }

    // profile: GET /profile
    public async getProfile(): Promise<ProfileResponse> {
        return this.request<ProfileResponse>("profile");
    }

    // profile_change_name: GET /profile_change_name
    public async getProfileChangeName(): Promise<ProfileChangeNameResponse> {
        return this.request<ProfileChangeNameResponse>("profile_change_name");
    }
}

// Экспортируем синглтон-сервис, чтобы не создавать экземпляр каждый раз
const apiService = new ApiService();
export default apiService;
