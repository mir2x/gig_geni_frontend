"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { useLoginMutation } from "@/lib/api/authApi";
import { loginSchema, LoginValues } from "@/lib/validations/auth";

interface LoginFormProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({
  onClose,
  onSwitchToSignup,
  onForgotPassword,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: isLoggingIn, error: apiError }] =
    useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      const response = await login(data).unwrap();
      onClose();
    } catch (err: any) {
      // Error handled by apiError
    }
  };

  const errorMessage =
    (apiError as any)?.data?.message ||
    "Login failed. Please check your credentials.";

  return (
    <div className="p-8">
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">Welcome Back</DialogTitle>
        <p className="text-muted-foreground">
          Sign in to continue to your dashboard
        </p>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`pl-10 h-12 ${errors.email ? "border-red-500" : ""}`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`pl-10 pr-10 h-12 ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={isLoggingIn} className="w-full h-12">
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-sm">Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
