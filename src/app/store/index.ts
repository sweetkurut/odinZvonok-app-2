import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../../entities/user';
import { orderSlice } from '../../entities/order';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    order: orderSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;