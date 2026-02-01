export const ORDER_STATUS_MAP: Record<string, { label: string; className: string }> = {
    PENDING_ASSIGNMENT: {
        label: "Ожидает назначения",
        className: "pending",
    },
    IN_PROGRESS: {
        label: "В работе",
        className: "inProgress",
    },
    COMPLETED: {
        label: "Завершён",
        className: "completed",
    },
    CANCELED: {
        label: "Отменён",
        className: "canceled",
    },
    ASSIGNED: {
        label: "Назначен",
        className: "assigned",
    },
};
