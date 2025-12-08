"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/lib/api/authApi";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/lib/validations/auth";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onOtpSent: (email: string, tempToken: string) => void;
}

export function ForgotPasswordForm({
  onBack,
  onOtpSent,
}: ForgotPasswordFormProps) {
  const [forgotPassword, { isLoading, error: apiError }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const response = await forgotPassword(data).unwrap();
      if (response.success && response.data) {
        onOtpSent(data.email, response.data.resetToken);
      }
    } catch (err) {
      // Error handled by apiError state
    }
  };

  const errorMessage =
    (apiError as any)?.data?.message || "Failed to send OTP. Please try again.";

  return (
    <div className="p-8">
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">Reset Password</DialogTitle>
        <p className="text-muted-foreground">
          Enter your email to receive a verification code
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

        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-12">
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-primary hover:underline"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
