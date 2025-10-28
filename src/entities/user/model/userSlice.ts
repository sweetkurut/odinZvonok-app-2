import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from './types';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: {
    id: '1',
    name: 'Пользователь',
    role: 'client',
  },
  isLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const userActions = userSlice.actions;