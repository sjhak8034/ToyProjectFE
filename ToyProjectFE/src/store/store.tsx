import { configureStore, createSlice } from "@reduxjs/toolkit";
import userReducer from "./userSlice";




// 스토어 설정 및 타입 지정
const store = configureStore({
  reducer: {
    user: userReducer, // userReducer가 userSlice.reducer여야 함
  },
});

// store/store.ts

// RootState, AppDispatch 타입 export (사용 시 유용)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
