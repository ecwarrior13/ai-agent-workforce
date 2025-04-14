"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/actions/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  calculatePasswordStrength,
  doPasswordsMatch,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  isPasswordRequirementMet,
} from "@/utils/validation";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const router = useRouter();

  // Calculate password strength
  // Calculate password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  // Check if passwords match when either password changes
  useEffect(() => {
    setPasswordMatch(doPasswordsMatch(password, confirmPassword));
  }, [password, confirmPassword]);

  async function handleSignUp(formData: FormData) {
    // Check if passwords match before submission
    const passwordValue = formData.get("password") as string;
    const confirmPasswordValue = formData.get("confirmPassword") as string;

    if (passwordValue !== confirmPasswordValue) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(formData);

      if (result.success) {
        toast.success(result.message);
        // Optionally redirect after successful signup
        setTimeout(() => {
          router.push("/sign-up/confirmation");
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-secondary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Let&apos;s get started. Fill in your details below to create an
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignUp} className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-white"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="youremail@example.com"
                  className="bg-white"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {password && (
                    <span className="text-xs text-muted-foreground">
                      Strength: {getPasswordStrengthText(passwordStrength)}
                    </span>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-white"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <Progress
                    value={passwordStrength}
                    className={cn(
                      "h-1",
                      getPasswordStrengthColor(passwordStrength)
                    )}
                  />
                )}
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li
                    className={cn(
                      isPasswordRequirementMet(password, "length")
                        ? "text-green-600"
                        : ""
                    )}
                  >
                    • At least 8 characters
                  </li>
                  <li
                    className={cn(
                      isPasswordRequirementMet(password, "number")
                        ? "text-green-600"
                        : ""
                    )}
                  >
                    • At least one number
                  </li>
                  <li
                    className={cn(
                      isPasswordRequirementMet(password, "lowercase")
                        ? "text-green-600"
                        : ""
                    )}
                  >
                    • At least one lowercase letter
                  </li>
                  <li
                    className={cn(
                      isPasswordRequirementMet(password, "uppercaseOrSpecial")
                        ? "text-green-600"
                        : ""
                    )}
                  >
                    • At least one uppercase letter or special character
                  </li>
                </ul>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={cn(
                    "bg-white",
                    !passwordMatch && confirmPassword ? "border-red-500" : ""
                  )}
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {!passwordMatch && confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-xs text-blue-700">
                  After signing up, you&apos;ll need to verify your email
                  address before you can log in.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (confirmPassword && !passwordMatch)}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
