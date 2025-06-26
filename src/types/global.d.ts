declare global {
    interface Window {
        userData?: { id: number; [key: string]: any };
        gameInProgress: boolean;
        onBoardingRequired: boolean;
        tournamentWinData: { league: string, place: number, wins: number, difference: number, amount: number };
    }
}

export {};
