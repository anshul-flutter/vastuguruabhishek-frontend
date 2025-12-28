import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message ?? error?.message ?? fallbackMessage;
};

export const useLoginMutation = (options = {}) => {
  const dispatch = useAppDispatch();
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/auth/login", payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      dispatch(
        setCredentials({
          user: data?.data ?? null,
          token: data?.token ?? null,
        })
      );
      toast.success(data?.message ?? "Login successful");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error, "Something went wrong");
      const errorData = error?.response?.data?.data; // Get additional error data
      toast.error(message);
      onError?.(error, message, errorData, variables, context);
    },
    ...mutationOptions,
  });
};

export const useRegisterMutation = (options = {}) => {
  const dispatch = useAppDispatch();
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/auth/register", payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Store email for OTP verification (no token needed in new flow)
      const userEmail = data?.data?.email || variables?.email;
      dispatch(
        setCredentials({
          user: userEmail ? { email: userEmail } : null,
          token: null, // No token in new flow
        })
      );
      toast.success(data?.message ?? "Registration successful");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(
        error,
        "Something went wrong. Try again."
      );
      toast.error(message);
      onError?.(error, message, variables, context);
    },
    ...mutationOptions,
  });
};

// Admin login has been removed - all users now login through the same endpoint
// Role-based access is determined from the user object returned by the server

export const useVerifyOtpMutation = (options = {}) => {
  const dispatch = useAppDispatch();
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/auth/verify-otp", payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // User account created and logged in after OTP verification
      dispatch(
        setCredentials({
          user: data?.data ?? null,
          token: null, // JWT is in httpOnly cookie
        })
      );
      toast.success(data?.message ?? "Email verified successfully");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error, "OTP verification failed");
      toast.error(message);
      onError?.(error, message, variables, context);
    },
    ...mutationOptions,
  });
};

export const useResendOtpMutation = (options = {}) => {
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/auth/resend-otp", payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message ?? "OTP sent successfully");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error, "Failed to send OTP");
      toast.error(message);
      onError?.(error, message, variables, context);
    },
    ...mutationOptions,
  });
};

export const useForgotPasswordMutation = (options = {}) => {
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/auth/forgot-password", payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message ?? "Password reset email sent");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error, "Failed to send reset email");
      toast.error(message);
      onError?.(error, message, variables, context);
    },
    ...mutationOptions,
  });
};

export const useResetPasswordMutation = (options = {}) => {
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async ({ token, password, confirmPassword }) => {
      const response = await apiClient.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message ?? "Password reset successful");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error, "Password reset failed");
      toast.error(message);
      onError?.(error, message, variables, context);
    },
    ...mutationOptions,
  });
};

export const useChangePasswordMutation = (options = {}) => {
  const { onSuccess, onError, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/auth/change-password", payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message ?? "Password changed successfully");
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = getErrorMessage(error, "Failed to change password");
      toast.error(message);
      onError?.(error, message, variables, context);
    },
    ...mutationOptions,
  });
};

export const useCurrentUserQuery = (options = {}) => {
  const { queryKey = ["currentUser"], ...queryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get("/me");
      return response.data?.data ?? null;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    ...queryOptions,
  });
};
