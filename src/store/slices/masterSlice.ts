/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { MasterProfile } from "../types";

export type MasterStatus = "ONLINE" | "OFFLINE";

export interface Master {
    id: string;
    userId: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: MasterStatus;
    specializations: string[];
    profile_photo_object_name?: string;
}

type MasterState = {
    loading: boolean;
    error: string | null;
    profile: Master | null;
    statusUpdating: boolean;
};

const initialState: MasterState = {
    loading: false,
    error: null,
    profile: null,
    statusUpdating: false,
};

export const fetchProfileMaster = createAsyncThunk(
    "masters/fetchProfile",
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await storesApi.getProfileMaster(userId);
            return res.data;
        } catch {
            return rejectWithValue("Ошибка загрузки профиля");
        }
    },
);

export const updateProfileMaster = createAsyncThunk(
    "masters/updateProfile",
    async (data: Partial<Master>, { rejectWithValue }) => {
        try {
            const res = await storesApi.updateProfileMaster(data);
            return res.data;
        } catch {
            return rejectWithValue("Ошибка обновления профиля");
        }
    },
);

export const fetchMasters = createAsyncThunk("masters/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const res = await storesApi.getMasters();
        return res.data;
    } catch {
        return rejectWithValue("Ошибка загрузки мастеров");
    }
});

export const updateMasterStatus = createAsyncThunk(
    "masters/updateStatus",
    async (status: MasterStatus, { rejectWithValue }) => {
        try {
            const res = await storesApi.updateMasterStatus(status);
            return res.data; // обычно возвращает обновлённый профиль
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ошибка изменения статуса");
        }
    },
);

const mastersSlice = createSlice({
    name: "masters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileMaster.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfileMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfileMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateProfileMaster.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfileMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfileMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchMasters.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMasters.fulfilled, (state, action) => {
                state.loading = false;
                state.masters = action.payload;
            })
            .addCase(fetchMasters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Обновление статуса
            .addCase(updateMasterStatus.pending, (state) => {
                state.statusUpdating = true;
                state.error = null;
            })
            .addCase(updateMasterStatus.fulfilled, (state, action) => {
                state.statusUpdating = false;
                if (action.payload) {
                    state.profile = { ...state.profile, ...action.payload } as MasterProfile;
                }
            })
            .addCase(updateMasterStatus.rejected, (state, action) => {
                state.statusUpdating = false;
                state.error = action.payload as string;
            });
    },
});

export default mastersSlice.reducer;
