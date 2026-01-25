/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { Tariff } from "../types";

type MasterState = {
    loading: boolean;
    creating: boolean;
    error: string | null;
    masters: Tariff[] | null;
    isInitialLoading: boolean;
};

const initialState: MasterState = {
    loading: false,
    creating: false,
    error: null,
    masters: null,
    isInitialLoading: true,
};

export const fetchMasters = createAsyncThunk<Tariff[], void, { rejectValue: string }>(
    "masters/fetchMasters",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getMasters();
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

const MasterSlice = createSlice({
    name: "masters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMasters.fulfilled, (state, action) => {
                state.loading = false;
                state.masters = action.payload;
                state.isInitialLoading = false;
            })
            .addCase(fetchMasters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки тарифов";
                state.isInitialLoading = false;
            });
    },
});

// export const {} = MasterSlice.actions;
export default MasterSlice.reducer;
