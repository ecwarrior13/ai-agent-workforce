import { Metadata } from "next";
import React from "react";
import { SignInForm } from "@/components/auth/signin-form";
import Logo from "@/components/Logo";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Sign In - AIsemble",
  description: "Sign in to your AIsemble account",
};

export default async function SignInPage() {
  const supabase = await createClient();

  // Check if user is already authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <SignInForm />
      </div>
    </div>
  );
}
