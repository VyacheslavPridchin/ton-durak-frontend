declare global {
    interface Window {
        userData?: { id: number; [key: string]: any };
    }
}

export {};
