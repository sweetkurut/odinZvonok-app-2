import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "./types";

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
}

const initialState: OrderState = {
    orders: [
        {
            id: "1",
            title: "Ремонт бытовой техники",
            description: "Стиральная машина не сливает воду",
            status: "pending",
            clientId: "1",
            price: 2000,
            createdAt: "2024-01-15T10:30:00Z",
            images: ["https://images.pexels.com/photos/5825358/pexels-photo-5825358.jpeg"],
        },
    ],
    currentOrder: null,
    isLoading: false,
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },
        setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
            state.currentOrder = action.payload;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            state.orders.push(action.payload);
        },
        updateOrder: (state, action: PayloadAction<Order>) => {
            const index = state.orders.findIndex((order) => order.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const orderActions = orderSlice.actions;
