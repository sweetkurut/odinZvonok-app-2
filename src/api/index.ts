import type {
    CreateOrder,
    IFullRegisterRequest,
    IQuickRegisterRequest,
    ITelegramAuthRequest,
    IUpdateProfileRequest,
    Orders,
} from "@/store/types";
import instance from "./axiosInstance";

export const storesApi = {
    // регистрация

    telegramAuth(data: ITelegramAuthRequest) {
        return instance.post("/auth/telegram", data);
    },

    quickRegister(data: IQuickRegisterRequest) {
        return instance.post("/auth/register/quick", data);
    },

    fullRegister(data: IFullRegisterRequest) {
        return instance.post("/auth/register/full", data);
    },

    completeRegistration(data: IUpdateProfileRequest) {
        return instance.post("/auth/complete-registration", data);
    },

    updateProfile(data: IUpdateProfileRequest) {
        return instance.put("/auth/profile", data);
    },

    refreshToken(refresh_token: string) {
        return instance.post("/auth/refresh", { refresh_token });
    },

    logout() {
        return instance.post("/auth/logout");
    },

    getMe() {
        return instance.get("/auth/me");
    },

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
        return instance.post<Orders>("/orders", orderData);
    },
};
