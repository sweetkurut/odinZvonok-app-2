/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UploadUrlResponse {
    uploadUrl: string;
    objectName: string;
}

interface FilesState {
    orderImageUploadUrl: string | null;
    orderAccessUrl: string | null;
    avatarUploadUrl: string | null;
    avatarObjectName: string | null;

    loading: boolean;
    error: string | null;
    lastOperation: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: FilesState = {
    orderImageUploadUrl: null,
    orderAccessUrl: null,
    avatarUploadUrl: null,
    avatarObjectName: null,
    loading: false,
    error: null,
    lastOperation: "idle",
};

export const getOrderImageUploadUrl = createAsyncThunk<UploadUrlResponse, void, { rejectValue: string }>(
    "files/getOrderImageUploadUrl",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post<UploadUrlResponse>("/api/files/upload-url/order-image");
            return response.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Не удалось получить URL для изображения заказа",
            );
        }
    },
);

export const getAvatarUploadUrl = createAsyncThunk<UploadUrlResponse, string, { rejectValue: string }>(
    "files/getAvatarUploadUrl",
    async (extension, { rejectWithValue }) => {
        try {
            const res = await axios.post<UploadUrlResponse>(
                `/api/files/upload-url/avatar?extension=${extension}`,
            );
            return res.data;
        } catch (err: any) {
            console.error(err);
            return rejectWithValue("Не удалось получить URL загрузки аватара");
        }
    },
);

const fileSlice = createSlice({
    name: "file",
    initialState,
    reducers: {
        clearUploadUrls(state) {
            state.orderImageUploadUrl = null;
            state.orderAccessUrl = null;
            state.avatarUploadUrl = null;
            state.avatarObjectName = null;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrderImageUploadUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.lastOperation = "pending";
            })
            .addCase(getOrderImageUploadUrl.fulfilled, (state, action: PayloadAction<UploadUrlResponse>) => {
                state.loading = false;
                state.orderImageUploadUrl = action.payload.uploadUrl;
                state.orderAccessUrl = action.payload.accessUrl;
                state.lastOperation = "succeeded";
            })
            .addCase(getOrderImageUploadUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.lastOperation = "failed";
            });

        builder
            .addCase(getAvatarUploadUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvatarUploadUrl.fulfilled, (state, action: PayloadAction<UploadUrlResponse>) => {
                state.loading = false;
                state.avatarUploadUrl = action.payload.uploadUrl;
                state.avatarObjectName = action.payload.objectName;
            })
            .addCase(getAvatarUploadUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка";
            });
    },
});

export const { clearUploadUrls, clearError } = fileSlice.actions;

export default fileSlice.reducer;
