declare global {
    interface Window {
        userData?: { id: number; [key: string]: any };
        gameInProgress: boolean;
    }
}

export {};
