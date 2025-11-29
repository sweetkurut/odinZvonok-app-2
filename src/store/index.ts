import { configureStore } from "@reduxjs/toolkit";
import OrderSlice from './slices/orderSlice'

export const store = configureStore({
    reducer: {
        orders: OrderSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
