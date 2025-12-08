import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  VerifyOtpPayload,
  RefreshTokenPayload,
  ApiResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/types";

import { userLoggedIn } from "@/lib/features/auth/authSlice";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation<
      ApiResponse<LoginResponse>,
      { payload: VerifyOtpPayload; tempToken: string }
    >({
      query: ({ payload, tempToken }) => ({
        url: "/auth/verifyOTP",
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${tempToken}` },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // The backend returns user, accessToken, refreshToken on success for both Verify and Reset types.
          // We can log the user in immediately.
          if (data.success && data.data) {
            dispatch(userLoggedIn(data.data));
          }
        } catch (error) {
          console.error("OTP Verification failed:", error);
        }
      },
    }),
    login: builder.mutation<ApiResponse<LoginResponse>, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data.data!));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    refreshToken: builder.mutation<
      ApiResponse<LoginResponse>,
      RefreshTokenPayload
    >({
      query: (payload) => ({
        url: "/auth/refresh",
        method: "POST",
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponse>,
      ForgotPasswordPayload
    >({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    resendOtp: builder.mutation<
      ApiResponse<ResendOtpResponse>,
      ResendOtpPayload
    >({
      query: (payload) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<ResetPasswordResponse>,
      ResetPasswordPayload
    >({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;
