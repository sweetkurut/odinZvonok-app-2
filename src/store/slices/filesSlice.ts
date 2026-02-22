/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@/api/axiosInstance"; // ваш настроенный instance

interface UploadFormResponse {
    url: string;
    fields: Record<string, string>;
    objectName: string;
}

interface DownloadUrlResponse {
    downloadUrl: string;
}

interface FilesState {
    avatarUploadMeta: {
        url: string | null;
        fields: Record<string, string> | null;
        objectName: string | null;
    };
    avatarDownloadUrl: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: FilesState = {
    avatarUploadMeta: {
        url: null,
        fields: null,
        objectName: null,
    },
    avatarDownloadUrl: null,
    loading: false,
    error: null,
};

export const getAvatarUploadMeta = createAsyncThunk<
    UploadFormResponse,
    { extension: string },
    { rejectValue: string }
>("files/getAvatarUploadMeta", async ({ extension }, { rejectWithValue }) => {
    try {
        console.log("🔵 Sending POST to upload-form...");

        // ВАЖНО: убираем /api/, так как оно уже есть в baseURL
        const response = await instance.post<UploadFormResponse>(
            `/files/upload-form/avatar?extension=${extension}`,
            {}, // пустое тело
            {
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                },
            },
        );

        console.log("🟢 Response status:", response.status);
        console.log("🟢 Response data:", response.data);

        if (!response.data.url) {
            console.error("❌ URL отсутствует в ответе!");
            throw new Error("Server response missing 'url' field");
        }

        return response.data;
    } catch (err: any) {
        console.error("❌ Error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            config: err.config?.url, // посмотрим, какой URL реально вызывался
        });

        let errorMessage = "Failed to get upload meta";
        if (err.response?.status === 403) {
            errorMessage = "Ошибка авторизации (403) - проверьте токен";
        } else if (err.response?.status === 404) {
            errorMessage = "URL не найден (404) - проверьте путь";
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }

        return rejectWithValue(errorMessage);
    }
});

export const getAvatarDownloadUrl = createAsyncThunk<string, string, { rejectValue: string }>(
    "files/getAvatarDownloadUrl",
    async (objectName, { rejectWithValue }) => {
        try {
            const response = await instance.get<DownloadUrlResponse>(`/files/download-url`, {
                params: { objectName },
                headers: {
                    accept: "*/*",
                },
            });
            return response.data.downloadUrl;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Failed to get download URL",
            );
        }
    },
);

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        clearAvatarUploadMeta: (state) => {
            state.avatarUploadMeta = { url: null, fields: null, objectName: null };
        },
        clearAvatarDownloadUrl: (state) => {
            state.avatarDownloadUrl = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAvatarUploadMeta.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvatarUploadMeta.fulfilled, (state, action) => {
                state.loading = false;
                state.avatarUploadMeta = {
                    url: action.payload.url,
                    fields: action.payload.fields,
                    objectName: action.payload.objectName,
                };
            })
            .addCase(getAvatarUploadMeta.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Upload meta error";
            })
            .addCase(getAvatarDownloadUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvatarDownloadUrl.fulfilled, (state, action) => {
                state.loading = false;
                state.avatarDownloadUrl = action.payload;
            })
            .addCase(getAvatarDownloadUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Download URL error";
            });
    },
});

export const { clearAvatarUploadMeta, clearAvatarDownloadUrl, clearError } = filesSlice.actions;
export default filesSlice.reducer;
