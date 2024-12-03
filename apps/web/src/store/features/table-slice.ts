import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./user-slice";

export const role = ["", "Admin", "User"];

export interface TableState<T> {
  result: T[];
  archive: T[];
  count: number;
  page: number;
  pageSize: number;
  nextUrl: string;
  previousUrl: string;
  status: number;
}

const store = createSlice({
  name: "table",
  initialState: {} as TableState<UserState>,
  reducers: {
    addTable: (
      state: TableState<UserState>,
      action: PayloadAction<UserState>
    ) => {
      Object.keys(action.payload).forEach((key) => {
        (state as unknown as { [key: string]: unknown })[key] = (
          action.payload as unknown as { [key: string]: unknown }
        )[key];
      });
    },
    sortTable: (
      state: TableState<UserState>,
      action: PayloadAction<{ name: string; type: string }>
    ) => {
      state.result = state.result.sort((a, b) =>
        action.payload.type === "asc"
          ? String((a as { [key: string]: any })[action.payload.name])
              ?.toLowerCase()
              ?.localeCompare(
                String(
                  (b as { [key: string]: any })[action.payload.name]
                )?.toLowerCase()
              )
          : String((b as { [key: string]: any })[action.payload.name])
              ?.toLowerCase()
              ?.localeCompare(
                String(
                  (a as { [key: string]: any })[action.payload.name]
                )?.toLowerCase()
              )
      );
    },
    searchTable: (
      state: TableState<UserState>,
      action: PayloadAction<string>
    ) => {
      state.archive = state.result.filter(
        (item) =>
          item.name?.toLowerCase()?.indexOf(action.payload.toLowerCase()) >
            -1 ||
          item.email?.toLowerCase()?.indexOf(action.payload.toLowerCase()) > -1
          || item.pic?.toLowerCase()?.indexOf(action.payload.toLowerCase()) > -1
      );
    },
  },
});

export const { addTable, sortTable, searchTable } = store.actions;
export const tableReducer = store.reducer;
