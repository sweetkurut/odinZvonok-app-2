/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { Master, MasterStatus } from "../types";

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

export const fetchProfileMaster = createAsyncThunk(
    "masters/profile",
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await storesApi.getProfileMaster(userId);
            return res.data;
        } catch (error: any) {
            console.error(error);

            return rejectWithValue("Ошибка загрузки профиля");
        }
    },
);

export const updateMasterStatus = createAsyncThunk(
    "masters/updateStatus",
    async (status: MasterStatus, { rejectWithValue }) => {
        try {
            const res = await storesApi.updateMasterStatus(status);
            return res.data;
        } catch {
            return rejectWithValue("Ошибка обновления статуса");
        }
    },
);


// обновить профиль мастера
export const updateProfileMaster = createAsyncThunk(
    "masters/updateProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const res = await storesApi.updateProfileMaster(data);
            return res.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue("Ошибка обновления профиля");
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
            })

            .addCase(updateProfileMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileMaster.fulfilled, (state, action) => {
                state.masters = action.payload;
                state.loading = false;
            })
            .addCase(updateProfileMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка обновления профиля";
            });
    },
});
// export const {} = MasterSlice.actions;
export default MasterSlice.reducer;
