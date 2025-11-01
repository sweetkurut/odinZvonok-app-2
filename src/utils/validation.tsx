/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleApiError = (error: any, defaultMessage: string): string => {
    if (!error.response) {
        return defaultMessage;
    }

    const { data } = error.response;

    if (data && data.non_field_errors && data.non_field_errors.length > 0) {
        return data.non_field_errors[0];
    }

    if (data && data.error) {
        return data.error;
    }

    if (data && data.email && data.email.length > 0) {
        return data.email[0];
    }

    if (typeof data === "string") {
        return data;
    }

    return `Ошибка: ${error.response.status || "неизвестная"}`;
};

export const formatTime = (time: string) => {
    const date = new Date(time);
    const day = date.toLocaleString("ru-RU", { day: "2-digit" });
    const month = date.toLocaleString("ru-RU", { month: "2-digit" });
    const year = date.toLocaleString("ru-RU", { year: "numeric" });
    const hour = date.toLocaleString("ru-RU", { hour: "2-digit" });
    const minute = date.toLocaleString("ru-RU", { minute: "2-digit" });
    return `${day}.${month}.${year} ${hour}:${minute}`;
};

export const formatTimeChat = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatMessageTime = (dateString: string): string => {
    try {
        let date: Date;

        if (dateString.includes("T")) {
            date = new Date(dateString);
        } else if (dateString.includes(".") && dateString.length <= 16) {
            const [datePart, timePart] = dateString.split(" ");
            const [day, month, year] = datePart.split(".");
            const [hour, minute] = timePart.split(":");
            date = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hour),
                parseInt(minute)
            );
        } else {
            date = new Date(dateString);
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        const timeString = date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (messageDate.getTime() === today.getTime()) {
            return timeString;
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return `Вчера ${timeString}`;
        } else {
            return `${date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
            })} ${timeString}`;
        }
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
};

export const formatCarName = (name: string) => {
    return name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
