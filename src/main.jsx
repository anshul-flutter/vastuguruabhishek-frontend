import { HelmetProvider } from "react-helmet-async";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5, // 5 minutes - increased for better caching
			cacheTime: 1000 * 60 * 30, // 30 minutes cache
			// Enable background refetch but prevent aggressive refetching
			refetchOnMount: true,
			refetchOnReconnect: "always",
			// Reduce network calls by suspending queries when not needed
			suspense: false,
		},
		mutations: {
			retry: 1,
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<HelmetProvider>
				 <BrowserRouter>
				    <App />
 				 </BrowserRouter>
				</HelmetProvider>

				<Toaster position="top-right" toastOptions={{ duration: 2000 }} />
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>
);
