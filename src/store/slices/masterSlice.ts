/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storesApi } from "@/api";
import type { MasterProfile, MasterStatus, Master } from "../types";

interface MasterState {
    loading: boolean;
    error: string | null;
    profile: MasterProfile | null;
    masters: Master[];
    statusUpdating: boolean;
}

const initialState: MasterState = {
    loading: false,
    error: null,
    profile: null,
    masters: [],
    statusUpdating: false,
};

export const fetchProfileMaster = createAsyncThunk("masters/fetchProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await storesApi.getProfileMaster();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ошибка загрузки профиля");
    }
});

export const updateProfileMaster = createAsyncThunk(
    "masters/updateProfile",
    async (data: Partial<MasterProfile>, { rejectWithValue }) => {
        try {
            const response = await storesApi.updateProfileMaster(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка обновления профиля");
        }
    },
);

export const fetchMasters = createAsyncThunk("masters/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await storesApi.getMasters();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Ошибка загрузки мастеров");
    }
});

export const fetchMasterById = createAsyncThunk(
    "masters/fetchById",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await storesApi.getMasterById(userId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка загрузки мастера");
        }
    },
);

export const updateMasterStatus = createAsyncThunk(
    "masters/updateStatus",
    async (status: MasterStatus, { rejectWithValue }) => {
        try {
            const response = await storesApi.updateMasterStatus(status);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка изменения статуса");
        }
    },
);

const mastersSlice = createSlice({
    name: "masters",
    initialState,
    reducers: {
        clearMasterError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchProfileMaster
            .addCase(fetchProfileMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfileMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // updateProfileMaster
            .addCase(updateProfileMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfileMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // fetchMasters
            .addCase(fetchMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMasters.fulfilled, (state, action) => {
                state.loading = false;
                state.masters = action.payload;
            })
            .addCase(fetchMasters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // fetchMasterById
            .addCase(fetchMasterById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMasterById.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload
                // Можно сохранять в отдельное поле или обрабатывать по-другому
            })
            .addCase(fetchMasterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // updateMasterStatus
            .addCase(updateMasterStatus.pending, (state) => {
                state.statusUpdating = true;
                state.error = null;
            })
            .addCase(updateMasterStatus.fulfilled, (state, action) => {
                state.statusUpdating = false;
                if (action.payload) {
                    state.profile = { ...state.profile, ...action.payload };
                }
            })
            .addCase(updateMasterStatus.rejected, (state, action) => {
                state.statusUpdating = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMasterError } = mastersSlice.actions;
export default mastersSlice.reducer;
