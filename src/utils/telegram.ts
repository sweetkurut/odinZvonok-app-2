/* eslint-disable @typescript-eslint/no-explicit-any */

export const getTelegram = () => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
        throw new Error("Приложение не заупущено в Telegram");
    }
};
