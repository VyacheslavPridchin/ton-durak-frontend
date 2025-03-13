import mitt from 'mitt';

export type Events = {
    showPopup: string;
    hidePopup: void;

    showNotification: { title: string, subtitle: string, icon: string, sticker: string };
};

export const events = mitt<Events>();
