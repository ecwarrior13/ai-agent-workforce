import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Logo from "@/components/Logo";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Forgot Password - AIsemble",
  description: "Reset your password to regain access to your account",
};

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Logo />
      <ResetPasswordForm className="w-full max-w-md" />
    </div>
  );
}
