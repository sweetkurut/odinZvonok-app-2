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

            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки заказа";
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
            });
    },
});

export const { clearCreateError } = ordersSlice.actions;
export default ordersSlice.reducer;
