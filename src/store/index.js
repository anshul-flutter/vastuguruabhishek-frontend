import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { injectStore } from "../utils/apiClient";

const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

injectStore(store);

export default store;
export const AppDispatch = store.dispatch;
export const RootState = store.getState;
