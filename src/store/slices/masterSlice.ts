/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";

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
};

const initialState: MasterState = {
    loading: false,
    error: null,
    profile: null,
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
            });
    },
});

export default mastersSlice.reducer;
