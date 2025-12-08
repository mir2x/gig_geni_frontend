"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { SignupFlow } from "./SignupFlow";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { VerifyOtpPayload } from "@/types";
import { VerificationSuccess } from "./VerificationSuccess";
import { OtpInput } from "./OtpInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/lib/api/authApi";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
  onVerificationNeeded: (email: string, tempAccessToken: string) => void;
}

type AuthMode =
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password-otp"
  | "reset-password-form"
  | "verification-success";

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
  onVerificationNeeded,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  useEffect(() => {
    if (defaultMode === "login" || defaultMode === "signup") {
      setMode(defaultMode);
    }
  }, [defaultMode]);

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
  };

  const handleOpenChange = (open: boolean) => {
    // Only close if explicitly requested by internal components or valid interactions
    // This handler catches clicking X or internal close calls if wired that way.
    // However, Radix UI Dialog `onOpenChange` fires on backdrop click too.
    // We prevent backdrop click closing via `onInteractOutside` on `DialogContent`.
    if (!open) {
      onClose();
    }
  };

  const handleResetOtpSent = (email: string, tempToken: string) => {
    setResetEmail(email);
    setResetToken(tempToken);
    handleModeSwitch("reset-password-otp");
  };

  const handleResendOtp = async () => {
    try {
      setOtpError("");
      await resendOtp({ email: resetEmail }).unwrap();
      // Optionally show a success toast or message "OTP Resent"
    } catch (err: any) {
      setOtpError(err.data?.message || "Failed to resend OTP");
    }
  };

  const handleOtpComplete = async (fullOtp: string) => {
    setOtpError("");
    const payload: VerifyOtpPayload = {
      type: "Reset",
      otp: fullOtp,
    };

    try {
      const response = await verifyOtp({
        payload,
        tempToken: resetToken,
      }).unwrap();
      if (response.success) {
        handleModeSwitch("reset-password-form");
      }
    } catch (err: any) {
      setOtpError(err.data?.message || "Invalid OTP");
    }
  };

  const handleResetSuccess = () => {
    handleModeSwitch("verification-success");
    // After a delay or user action, go back to login or close
    setTimeout(() => {
      onClose();
      // Optionally reload or redirect if needed, but user is logged in now.
      window.location.reload(); // To reflect auth state if not using persistent state properly
    }, 2000);
  };

  const renderContent = () => {
    switch (mode) {
      case "login":
        return (
          <LoginForm
            onClose={onClose}
            onSwitchToSignup={() => handleModeSwitch("signup")}
            onForgotPassword={() => handleModeSwitch("forgot-password")}
          />
        );
      case "signup":
        return (
          <SignupFlow
            onVerificationNeeded={onVerificationNeeded}
            onSwitchToLogin={() => handleModeSwitch("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onBack={() => handleModeSwitch("login")}
            onOtpSent={handleResetOtpSent}
          />
        );
      case "reset-password-otp":
        return (
          <div className="p-8">
            <DialogHeader className="text-center mb-8">
              <DialogTitle className="text-3xl font-bold">
                Enter Verification Code
              </DialogTitle>
              <p className="text-muted-foreground">
                We sent a code to {resetEmail}
              </p>
            </DialogHeader>
            <div className="space-y-6">
              <OtpInput
                otp={otp}
                setOtp={setOtp}
                onComplete={handleOtpComplete}
                isDisabled={isVerifying}
              />
              {otpError && (
                <Alert variant="destructive">
                  <AlertDescription>{otpError}</AlertDescription>
                </Alert>
              )}
              <div className="text-center space-y-4">
                <Button
                  variant="ghost"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="text-primary hover:text-primary/90"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
                <div>
                  <button
                    onClick={() => handleModeSwitch("login")}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "reset-password-form":
        return <ResetPasswordForm onSuccess={handleResetSuccess} />;
      case "verification-success":
        return (
          <VerificationSuccess
            message="Your password has been reset successfully."
            onClose={() => {
              onClose();
              window.location.reload();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md mx-auto p-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
