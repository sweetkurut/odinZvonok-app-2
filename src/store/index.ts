import { configureStore } from "@reduxjs/toolkit";
import OrderSlice from "./slices/orderSlice";
import AuthSlice from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        orders: OrderSlice,
        auth: AuthSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
