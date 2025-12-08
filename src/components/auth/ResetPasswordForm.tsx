"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/lib/api/authApi";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/lib/validations/auth";
import { useState } from "react";

interface ResetPasswordFormProps {
  onSuccess: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading, error: apiError }] =
    useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      const response = await resetPassword({
        newPassword: data.password,
      }).unwrap();
      if (response.success) {
        onSuccess();
      }
    } catch (err) {
      // Error handled by apiError state
    }
  };

  const errorMessage =
    (apiError as any)?.data?.message ||
    "Failed to reset password. Please try again.";

  return (
    <div className="p-8">
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">New Password</DialogTitle>
        <p className="text-muted-foreground">
          Create a new password for your account
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
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

        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className={`pl-10 pr-10 h-12 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-12">
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
