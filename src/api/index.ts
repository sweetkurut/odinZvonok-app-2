/* eslint-disable @typescript-eslint/no-unused-vars */
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
    getAllOrders(params = {}) {
        const { page = 0, size = 10, sort = "created_at,desc" } = params;
        return instance
            .get<Orders>("/orders/my", { params })
            .then((res) => {
                console.log("Orders response:", res.data);
                return res;
            })
            .catch((err) => {
                console.error("Orders error:", err);
                throw err;
            });
    },

    // получить все заказы (оператор, админ)
    getAllOrdersOperatorAdmin(params = {}) {
        return instance.get<Orders>("/orders/all", { params });
    },

    getOrderById(orderId: string) {
        return instance.get(`/orders/${orderId}`);
    },

    createOrder(orderData: CreateOrder) {
        return instance.post<Orders>("/orders", orderData);
    },

    // createOrder(formData: FormData) {
    //     return instance.post<Orders>("/orders", formData, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         },
    //     });
    // },

    // тарифы
    getTariffs() {
        return instance.get("/tariffs");
    },

    //  мастера
    getMasters() {
        return instance.get("/masters");
    },

    getMasterById(userId: string) {
        return instance.get(`/masters/${userId}`);
    },

    // Обновить свой статус доступности (для мастеров)
    updateMasterAvailability(status: boolean) {
        return instance.patch("/masters/profile/status", { status });
    },

    // получить все отзыывы о мастере
    getReviewsByMasterId(masterUserId: string) {
        return instance.get(`/masters/${masterUserId}/reviews`);
    },

    // создать или обновить свой профиль мастера
    upsertMasterProfile(data: FormData) {
        return instance.put("/masters/profile", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
