import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "authState";

const readInitialState = () => {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const storedValue = window.localStorage.getItem(STORAGE_KEY);
		if (!storedValue) {
			return null;
		}
		return JSON.parse(storedValue);
	} catch (error) {
		console.warn("Failed to read auth state from storage", error);
		return null;
	}
};

const persistState = (state) => {
	if (typeof window === "undefined") {
		return;
	}

	try {
		const payload = JSON.stringify({
			user: state.user,
			token: state.token,
			selectedRole: state.selectedRole,
		});
		window.localStorage.setItem(STORAGE_KEY, payload);
	} catch (error) {
		console.warn("Failed to persist auth state", error);
	}
};

const clearPersistedState = () => {
	if (typeof window === "undefined") {
		return;
	}

	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.warn("Failed to clear auth state", error);
	}
};

const persisted = readInitialState();

const initialState = {
	user: persisted?.user ?? null,
	token: persisted?.token ?? null,
	selectedRole: persisted?.selectedRole ?? "student",
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { user, token } = action.payload ?? {};
			state.user = user ?? null;
			state.token = token ?? null;
			persistState(state);
		},
		updateUser: (state, action) => {
			if (!state.user) {
				state.user = action.payload ?? null;
			} else {
				state.user = { ...state.user, ...action.payload };
			}
			persistState(state);
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.selectedRole = "student";
			clearPersistedState();
		},
		setSelectedRole: (state, action) => {
			state.selectedRole = action.payload ?? "student";
			persistState(state);
		},
	},
});

export const { setCredentials, updateUser, logout, setSelectedRole } =
	authSlice.actions;

export const selectAuthState = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectSelectedRole = (state) => state.auth.selectedRole;

export default authSlice.reducer;
