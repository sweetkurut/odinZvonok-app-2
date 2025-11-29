import type { CreateOrder, Orders, PageResponse } from "@/store/types";
import instance from "./axiosInstance";

export const storesApi = {
    // получение списка всех заказов (клиент)
    getAllOrders(
        params: {
            page?: number;
            size?: number;
            sort?: string;
        } = {}
    ) {
        const { page = 0, size = 10, sort = "created_at,desc" } = params;

        return instance.get<Orders>("/orders/my", {
            params: {
                page,
                size,
                sort,
            },
        });
    },

    createOrder(orderData: CreateOrder) {
    return instance.post<Orders>('/orders', orderData); // важно указать тип ответа
    }
};
