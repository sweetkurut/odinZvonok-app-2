/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IRefreshTokenResponse } from "../types";
import { storesApi } from "@/api";

// Интерфейс пользователя из ответа /auth/telegram
export interface IUser {
    id: string;
    telegram_id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    profile_photo_url?: string;
    role: "client" | "operator" | "master";
    is_registration_complete: boolean;
    full_name?: string;
}

// Ответ от /auth/telegram
interface ITelegramAuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: IUser;
}

// Utils для токенов
const saveTokens = (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
};

const removeTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

type AuthState = {
    loading: boolean;
    error: string | null;
    user: IUser | null;
    isAuthenticated: boolean;
    isInitialLoading: boolean;
};

const initialState: AuthState = {
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false,
    isInitialLoading: true,
};

/* ===================== THUNKS ===================== */

// Основной вход через Telegram
export const fetchTelegramAuth = createAsyncThunk<ITelegramAuthResponse, string, { rejectValue: string }>(
    "auth/telegramAuth",
    async (initData, { rejectWithValue }) => {
        try {
            const res = await storesApi.telegramAuth({ init_data: initData });
            console.log("====================================");
            console.log(res);
            console.log("====================================");
            saveTokens(res.data.access_token, res.data.refresh_token);
            return res.data;
        } catch (e: any) {
            const message = e.response?.data?.message || "Ошибка авторизации через Telegram";
            return rejectWithValue(message);
        }
    },
);

// Получение свежего профиля (если нужно)
export const fetchMe = createAsyncThunk<IUser, void, { rejectValue: string }>(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await storesApi.getMe();
            return res.data;
        } catch (error: any) {
            console.error(error);

            return rejectWithValue("Не удалось загрузить профиль");
        }
    },
);

// Refresh токена
export const fetchRefreshToken = createAsyncThunk<IRefreshTokenResponse, void, { rejectValue: string }>(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const refresh = localStorage.getItem("refreshToken");
            if (!refresh) throw new Error("Нет refresh токена");
            const res = await storesApi.refreshToken(refresh);
            saveTokens(res.data.access_token, res.data.refresh_token);
            return res.data;
        } catch {
            removeTokens();
            return rejectWithValue("Сессия истекла");
        }
    },
);

export const completeRegistration = createAsyncThunk(
    "auth/completeRegistration",
    async (data: any, { rejectWithValue }) => {
        try {
            console.log("🔵 Sending to /auth/complete-registration:", {
                url: "/auth/complete-registration",
                data: data,
                dataType: typeof data,
                keys: Object.keys(data),
            });

            const res = await storesApi.completeRegistration(data);
            console.log("🟢 Response:", res.data);
            return res.data;
        } catch (e: any) {
            console.error("❌ Complete registration error:", {
                status: e.response?.status,
                data: e.response?.data,
                message: e.message,
            });
            return rejectWithValue(e.response?.data?.message || "Ошибка завершения регистрации");
        }
    },
);

// Logout
export const fetchLogout = createAsyncThunk("auth/logout", async () => {
    try {
        await storesApi.logout();
    } finally {
        removeTokens();
    }
});

/* ===================== SLICE ===================== */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            removeTokens();
        },
    },
    extraReducers: (builder) => {
        builder
            // Telegram Auth
            .addCase(fetchTelegramAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTelegramAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(fetchTelegramAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка авторизации";
                state.isAuthenticated = false;
            })

            // fetchMe
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isInitialLoading = false;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.isInitialLoading = false;
            })

            // Refresh & Logout
            .addCase(fetchRefreshToken.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                removeTokens();
            })
            .addCase(fetchLogout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            // completeRegistration
            .addCase(completeRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(completeRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка сохранения профиля";
            });
    },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
