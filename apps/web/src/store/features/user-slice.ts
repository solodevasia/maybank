import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    id: number;
    name: string;
    email: string;
    pic: string;
    role: number | string;
    is_active: boolean;
    created_at: string;
}

const store = createSlice({
    name: 'auth',
    initialState: {} as UserState,
    reducers: {
        getProfile: (state, action: PayloadAction<UserState>) => {
            Object.keys(action.payload).forEach((key) => {
                (state as {[key:string]: unknown})[key] = (action.payload as unknown as {[key:string]: unknown})[key]
            })
        }
    }
})

export const {getProfile} = store.actions
export const userReducer = store.reducer