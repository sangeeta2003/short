import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import linksReducer from './slices/linksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linksReducer,
  },
}); 