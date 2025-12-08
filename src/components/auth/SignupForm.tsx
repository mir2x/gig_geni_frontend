"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, User, Building, Phone } from "lucide-react";
import { useRegisterMutation } from "@/lib/api/authApi";
import { UserRole } from "@/lib/features/user/types";
import { RegisterPayload } from "@/types";
import { signupSchema, SignupValues } from "@/lib/validations/auth";

interface SignupFormProps {
  userType: UserRole;
  onBack: () => void;
  onVerificationNeeded: (email: string, tempAccessToken: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({
  userType,
  onBack,
  onVerificationNeeded,
  onSwitchToLogin,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading: isRegistering, error: apiError }] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupValues) => {
    const payload: RegisterPayload = {
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      name: data.fullName,
      role: userType,
      ...(userType === "employer"
        ? { company: { name: data.companyName } }
        : {}),
    };

    try {
      const response = await registerUser(payload).unwrap();
      const tempAccessToken = response.data!.accessToken;

      if (tempAccessToken) {
        onVerificationNeeded(data.email, tempAccessToken);
      }
    } catch (err: any) {
      // Error handled by apiError
    }
  };

  const errorMessage =
    (apiError as any)?.data?.message || "Registration failed. Please try again.";

  return (
    <div>
      <DialogHeader className="text-center mb-8">
        <DialogTitle className="text-3xl font-bold">
          Create Your Account
        </DialogTitle>
        <p className="text-muted-foreground">
          Complete your registration to get started
        </p>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to account type
        </button>
        <div className="space-y-2">
          <label htmlFor="fullName">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className={`pl-10 h-12 ${
                errors.fullName ? "border-red-500" : ""
              }`}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>
        {userType === "employer" && (
          <div className="space-y-2">
            <label htmlFor="companyName">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                className={`pl-10 h-12 ${
                  errors.companyName ? "border-red-500" : ""
                }`}
                {...register("companyName")}
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-red-500">
                {errors.companyName.message}
              </p>
            )}
          </div>
        )}
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
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="phoneNumber"
              type="text"
              placeholder="Enter your Phone Number"
              className={`pl-10 h-12 ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
              {...register("phoneNumber")}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
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
        <div className="flex items-center">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="rounded border-gray-300 text-primary focus:ring-primary"
            {...register("agreeToTerms")}
          />
          <label
            htmlFor="agreeToTerms"
            className="ml-2 text-sm text-muted-foreground"
          >
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/policy"
              target="_blank"
              className="font-medium text-primary hover:underline"
            >
              Policy
            </a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
        )}
        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={isRegistering} className="w-full h-12">
          {isRegistering ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <div className="text-center mt-4">
        <span className="text-sm">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
