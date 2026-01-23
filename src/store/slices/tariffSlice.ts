/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { Tariff } from "../types";

type TariffsState = {
    loading: boolean;
    creating: boolean;
    error: string | null;
    tariffs: Tariff[] | null;
    isInitialLoading: boolean;
};

const initialState: TariffsState = {
    loading: false,
    creating: false,
    error: null,
    tariffs: null,
    isInitialLoading: true,
};

export const fetchTariffs = createAsyncThunk<Tariff[], void, { rejectValue: string }>(
    "tariffs/fetchTariffs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getTariffs();
            if (res.status !== 200) {
                return rejectWithValue(`Ошибка сервера: ${res.status}`);
            }
            return res.data as Tariff[];
        } catch (error: any) {
            console.error("fetchTariffs error:", error);
            return rejectWithValue(error?.response?.data?.message || "Ошибка загрузки тарифов");
        }
    },
);

const TariffSlice = createSlice({
    name: "tariffs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTariffs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTariffs.fulfilled, (state, action) => {
                state.loading = false;
                state.tariffs = action.payload;
                state.isInitialLoading = false;
            })
            .addCase(fetchTariffs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки тарифов";
                state.isInitialLoading = false;
            });
    },
});

// export const {} = TariffSlice.actions;
export default TariffSlice.reducer;
