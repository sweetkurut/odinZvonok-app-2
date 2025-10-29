export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Order {
    id: string;
    title: string;
    description: string;
    status: OrderStatus;
    clientId: string;
    masterId?: string;
    operatorId?: string;
    price?: number;
    createdAt: string;
    images?: string[];
}
