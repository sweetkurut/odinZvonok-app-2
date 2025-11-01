import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { Orders } from "../types";

type InfoState = {
    loading: boolean;
    error: null | string;
    orders: Orders[] | null;
};

const initialState: InfoState = {
    error: null,
    loading: false,
    orders: null,
};

export const fetchListOrders = createAsyncThunk<Orders[], void, { rejectValue: string }>(
    "orders/fetchListOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getAllOrders();
            console.log(res, "заказы для проверки 😍");
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера 🧐 ${res.status}`);
            }

            return res.data as Orders[];
        } catch (error: unknown) {
            console.error(error);
            return rejectWithValue(`Ошибка: ${error}`);
        }
    }
);

const AddressSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchListOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchListOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchListOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка";
            });
    },
});

export default AddressSlice.reducer;
