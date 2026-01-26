import { configureStore } from "@reduxjs/toolkit";
import OrderSlice from "./slices/orderSlice";
import AuthSlice from "./slices/authSlice";
import TariffSlice from "./slices/tariffSlice";
import MasterSlice from "./slices/masterSlice";

export const store = configureStore({
    reducer: {
        orders: OrderSlice,
        auth: AuthSlice,
        tariffs: TariffSlice,
        masters: MasterSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
