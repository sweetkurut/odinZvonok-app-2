/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    CompleteRegistrationRequest,
    CreateOrder,
    IFullRegisterRequest,
    IQuickRegisterRequest,
    ITelegramAuthRequest,
    IUpdateProfileRequest,
    MasterStatus,
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

    completeRegistration(data: CompleteRegistrationRequest) {
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

    // назначение мастеара на заказа

    assignmetnOrderMaster(orderId: string, masterId: string) {
        return instance.post(`/orders/${orderId}/assign-master/${masterId}`);
    },

    // Оператор подтверждает цену, предложенную мастером.
    confirmPrice(orderId: string) {
        return instance.post(`/orders/${orderId}/confirm-price`);
    },

    // Мастер или оператор/админ меняет статус заказа на 'Выполнен'.
    completeOrder(orderId: string) {
        return instance.post(`/orders/${orderId}/complete`);
    },

    // Любой участник сделки или оператор/админ может отменить заказ, если он еще не завершен.
    cancelOrder(orderId: string) {
        return instance.post(`/orders/${orderId}/cancel`);
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

    // список мастеров
    getMasters() {
        return instance.get("/masters");
    },

    // профиль текущего мастера
    getProfileMaster(userId: string) {
        return instance.get(`/masters/profile/${userId}`);
    },

    // создать / обновить профиль мастера
    updateProfileMaster(data: any) {
        return instance.put("/masters/profile", data);
    },

    // storesApi.ts
    updateMasterStatus(status: MasterStatus) {
        return instance.patch("/masters/profile/status", { status });
    },

    // профиль мастера по ID
    getMasterById(userId: string) {
        return instance.get(`/masters/${userId}`);
    },

    // отзывы мастера
    getMasterReviews(masterUserId: string) {
        return instance.get(`/masters/${masterUserId}/reviews`);
    },

    // оставить отзыв
    postMasterReview(masterUserId: string, data: any) {
        return instance.post(`/masters/${masterUserId}/reviews`, data);
    },
};
