import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/user-slice";
import { tableReducer } from "./features/table-slice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        table: tableReducer
    },
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch