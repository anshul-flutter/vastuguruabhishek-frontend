import axios from "axios";
import { logout } from "../store/slices/authSlice";

let reduxStore;

export const injectStore = (store) => {
	reduxStore = store;
};

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
	const requestConfig = { ...config };
	requestConfig.headers = requestConfig.headers ?? {};

	const token = reduxStore?.getState()?.auth?.token;
	if (token && !requestConfig.headers.Authorization) {
		requestConfig.headers.Authorization = `Bearer ${token}`;
	}

	return requestConfig;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			reduxStore?.dispatch?.(logout());
		}

		return Promise.reject(error);
	}
);

export default apiClient;
