/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IRefreshTokenResponse, ITelegramAuthResponse, IUser } from "../types";
import { storesApi } from "@/api";

// utils
const saveTokens = (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
};

const removeTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const hasTokens = () => {
    return !!localStorage.getItem("accessToken");
};

type AuthState = {
    loading: boolean;
    error: string | null;
    user: IUser | null;
    isAuthenticated: boolean;
};

const initialState: AuthState = {
    loading: false,
    error: null,
    user: null,
    isAuthenticated: hasTokens(),
};

/* ===================== THUNKS ===================== */

// Telegram auth
export const fetchTelegramAuth = createAsyncThunk<ITelegramAuthResponse, string>(
    "auth/telegramAuth",
    async (initData, { rejectWithValue }) => {
        try {
            const res = await storesApi.telegramAuth({ init_data: initData });
            saveTokens(res.data.access_token, res.data.refresh_token);
            return res.data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data || "Telegram auth error");
        }
    }
);

// Get me
export const fetchMe = createAsyncThunk<IUser>("auth/me", async (_, { rejectWithValue }) => {
    try {
        const res = await storesApi.getMe();
        return res.data;
    } catch (error: any) {
        console.error(error);

        return rejectWithValue("Не удалось получить пользователя");
    }
});

// Refresh
export const fetchRefreshToken = createAsyncThunk<IRefreshTokenResponse>(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const refresh = localStorage.getItem("refreshToken");
            if (!refresh) throw new Error();

            const res = await storesApi.refreshToken(refresh);
            saveTokens(res.data.access_token, res.data.refresh_token);
            return res.data;
        } catch {
            removeTokens();
            return rejectWithValue("Refresh token expired");
        }
    }
);

// Logout
export const fetchLogout = createAsyncThunk("auth/logout", async () => {
    await storesApi.logout();
    removeTokens();
});

/* ===================== SLICE ===================== */

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Telegram auth
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
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })

            // Me
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })

            // Refresh
            .addCase(fetchRefreshToken.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })

            // Logout
            .addCase(fetchLogout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export default authSlice.reducer;
