import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { CreateOrder, Orders } from "../types";

// Расширяем состояние — добавляем флаги для создания заказа
type OrdersState = {
    loading: boolean;
    creating: boolean; // новый флаг
    error: null | string;
    createError: null | string; // отдельная ошибка для создания
    orders: Orders[] | null;
};

const initialState: OrdersState = {
    loading: false,
    creating: false,
    error: null,
    createError: null,
    orders: null,
};

// Получение списка заказов
export const fetchOrders = createAsyncThunk<Orders[], void, { rejectValue: string }>(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getAllOrders();
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return res.data as Orders[];
        } catch (error: any) {
            console.error("fetchOrders error:", error);
            return rejectWithValue(error?.message || "Неизвестная ошибка при загрузке заказов");
        }
    }
);

// Создание нового заказа
export const createOrder = createAsyncThunk<
    Orders, // возвращаем созданный заказ
    CreateOrder, // аргумент — тело запроса
    { rejectValue: string }
>("orders/createOrder", async (orderData, { rejectWithValue }) => {
    try {
        const res = await storesApi.createOrder(orderData);

        if (res.status !== 200 && res.status !== 201) {
            return rejectWithValue(`Ошибка сервера: ${res.status}`);
        }

        return res.data as Orders; // предполагаем, что сервер возвращает созданный заказ
    } catch (error: any) {
        console.error("createOrder error:", error);
        const message = error?.response?.data?.message || error?.message || "Ошибка создания заказа";
        return rejectWithValue(message);
    }
});

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearCreateError: (state) => {
            state.createError = null;
        },
        // orders: ordersReducer,
    },
    extraReducers: (builder) => {
        builder
            // === fetchListOrders ===
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки заказов";
            })

            // === createOrder ===
            .addCase(createOrder.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.creating = false;
                // Добавляем новый заказ в начало списка (опционально)
                if (state.orders) {
                    state.orders.unshift(action.payload);
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
