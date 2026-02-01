/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { CreateOrder, Order, OrdersResponse } from "../types";

type OrdersState = {
    loading: boolean;
    creating: boolean;
    error: string | null;
    createError: string | null;
    orders: Order[] | null;
    orderDetails: Order | null;
    isInitialLoading: boolean;
};

const initialState: OrdersState = {
    loading: false,
    creating: false,
    error: null,
    createError: null,
    orders: null,
    orderDetails: null,
    isInitialLoading: true,
};

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getAllOrders();
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            // Возвращаем только content — массив заказов
            return (res.data as OrdersResponse).content;
        } catch (error: any) {
            console.error("fetchOrders error:", error);
            return rejectWithValue(error?.response?.data?.message || "Ошибка загрузки заказов");
        }
    },
);

// детальная информация
export const fetchOrderById = createAsyncThunk<Order, string, { rejectValue: string }>(
    "orders/fetchOrderById",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await storesApi.getOrderById(orderId);
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return res.data;
        } catch (error: any) {
            console.error("fetchOrderById error:", error);
            return rejectWithValue(error?.response?.data?.message || "Ошибка загрузки заказа");
        }
    },
);

export const fetchAllOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
    "orders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getAllOrdersOperatorAdmin();
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return (res.data as OrdersResponse).content;
        } catch (error: any) {
            console.error("fetchAllOrders error:", error);
            return rejectWithValue(error?.response?.data?.message || "Ошибка загрузки заказов");
        }
    },
);

// Если createOrder возвращает полный заказ — аналогично
export const createOrder = createAsyncThunk<Order, CreateOrder, { rejectValue: string }>(
    "orders/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await storesApi.createOrder(orderData);
            if (res.status !== 200 && res.status !== 201) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return res.data;
        } catch (error: any) {
            console.error("createOrder error:", error);
            return rejectWithValue(error?.response?.data?.message || "Ошибка создания заказа");
        }
    },
);

// назначие мастера на заказ
export const assignMasterToOrder = createAsyncThunk<
    Order,
    { orderId: string; masterId: string },
    { rejectValue: string }
>("orders/assignMasterToOrder", async ({ orderId, masterId }, { rejectWithValue }) => {
    try {
        const res = await storesApi.assignmetnOrderMaster(orderId, masterId);
        return res.data;
    } catch (error: any) {
        console.error("assignMasterToOrder error:", error);
        return rejectWithValue(error?.response?.data?.message || "Не удалось назначить мастера на заказ");
    }
});

// Подтверждение цены оператором
export const confirmOrderPrice = createAsyncThunk<Order, { orderId: string }, { rejectValue: string }>(
    "orders/confirmOrderPrice",
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const res = await storesApi.confirmPrice(orderId);
            return res.data;
        } catch (error: any) {
            console.error("confirmOrderPrice error:", error);
            return rejectWithValue(error?.response?.data?.message || "Не удалось подтвердить цену");
        }
    },
);

// Завершение заказа
export const completeOrder = createAsyncThunk<Order, { orderId: string }, { rejectValue: string }>(
    "orders/completeOrder",
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const res = await storesApi.completeOrder(orderId);
            return res.data;
        } catch (error: any) {
            console.error("completeOrder error:", error);
            return rejectWithValue(error?.response?.data?.message || "Не удалось завершить заказ");
        }
    },
);

// Отмена заказа
export const cancelOrder = createAsyncThunk<Order, { orderId: string }, { rejectValue: string }>(
    "orders/cancelOrder",
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const res = await storesApi.cancelOrder(orderId);
            return res.data;
        } catch (error: any) {
            console.error("cancelOrder error:", error);
            return rejectWithValue(error?.response?.data?.message || "Не удалось отменить заказ");
        }
    },
);

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearCreateError: (state) => {
            state.createError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.isInitialLoading = false;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки заказов";
                state.isInitialLoading = false;
            })

            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.isInitialLoading = false;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки заказов";
                state.isInitialLoading = false;
            })

            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
                state.error = null;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createOrder.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.creating = false;
                if (state.orders) {
                    state.orders.unshift(action.payload); // новый в начало
                } else {
                    state.orders = [action.payload];
                }
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload || "Не удалось создать заказ";
            })

            .addCase(assignMasterToOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(assignMasterToOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(assignMasterToOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка назначения мастера";
            })

            .addCase(confirmOrderPrice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmOrderPrice.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(confirmOrderPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка подтверждения цены";
            })

            // Завершение заказа
            .addCase(completeOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(completeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка завершения заказа";
            })

            // Отмена заказа
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка отмены заказа";
            });
    },
});

export const { clearCreateError } = ordersSlice.actions;
export default ordersSlice.reducer;
