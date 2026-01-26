/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { Master } from "../types";

type MasterState = {
    loading: boolean;
    creating: boolean;
    error: string | null;
    masters: Master[] | null;
    isInitialLoading: boolean;
};

const initialState: MasterState = {
    loading: false,
    creating: false,
    error: null,
    masters: null,
    isInitialLoading: true,
};

export const fetchMasters = createAsyncThunk("masters/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const res = await storesApi.getMasters();
        return res.data;
    } catch (e: any) {
        return rejectWithValue(e?.response?.data?.message || "Ошибка загрузки мастеров");
    }
});

export const fetchProfileMaster = createAsyncThunk("masters/profile", async (_, { rejectWithValue }) => {
    try {
        const res = await storesApi.getProfileMaster();
        return res.data;
    } catch (error: any) {
        console.error(error);

        return rejectWithValue("Ошибка загрузки профиля");
    }
});

export const updateMasterStatus = createAsyncThunk(
    "masters/status",
    async (status: "available" | "busy", { rejectWithValue }) => {
        try {
            const res = await storesApi.updateMasterStatus(status);
            return res.data;
        } catch {
            return rejectWithValue("Ошибка обновления статуса");
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
            })

            .addCase(fetchProfileMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.masters = action.payload;
                state.isInitialLoading = false;
            })
            .addCase(fetchProfileMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка загрузки профиля";
                state.isInitialLoading = false;
            })

            .addCase(updateMasterStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMasterStatus.fulfilled, (state, action) => {
                state.masters = action.payload;
                state.loading = false;
            })
            .addCase(updateMasterStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка обновления статуса";
            });
    },
});
// export const {} = MasterSlice.actions;
export default MasterSlice.reducer;
