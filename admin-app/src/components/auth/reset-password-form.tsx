"use client";

import { jwtDecode, JwtPayload } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/auth_validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect, useSearchParams } from "next/navigation";
import {
  useResendPasswordResetEmail,
  useResetUserPassword,
} from "@/services/auth_service/auth_mutations";
import AppLogo from "../app-logo";
import { useState } from "react";
import { Eye, EyeOff, MoveRight, XCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) redirect("/forgot-password");

  const checkTokenExpiry = () => {
    // TODO: check if token has expired and show the resend link button instead of the form
    const decodedToken: JwtPayload = jwtDecode(token);

    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
      // Token has expired
      return true;
    } else {
      return false;
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    mode: "all",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetUserPassword();

  const isTokenExpired = checkTokenExpiry();

  const { mutate: resendResetEmail, isPending: isResendPending } =
    useResendPasswordResetEmail();

  const onFormSubmit = (data: ResetPasswordInput) => {
    resetPassword(data);
  };

  if (isTokenExpired) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 h-[30rem]">
        <Card className="mx-auto max-w-md text-center border-none shadow-none">
          <CardHeader>
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold">Reset Link Expired</h1>
            <p className="text-sm text-muted-foreground">
              This link has expired or is no longer valid
            </p>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              For security reasons, links are only valid for a limited time. You
              can request a new link using the button below.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full gap-6"
              onClick={() => resendResetEmail(token)}
              disabled={isResendPending}
            >
              {isResendPending ? (
                <>
                  <span>Please wait</span>
                  <ClipLoader color="#fff" size={24} />
                </>
              ) : (
                <>
                  <span>Resend Link</span>
                  <span>
                    <MoveRight />
                  </span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-center">
        <AppLogo width={80} />
      </div>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold">Create a New Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below to complete the reset process. Ensure
          it&apos;s strong and secure.
        </p>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col gap-6 mt-6">
          <div>
            <Label htmlFor="username">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="username">Confirm Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                placeholder="Confirm your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-0 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Button size="lg" className="w-full gap-6">
              {isPending ? (
                <>
                  <span>Please wait</span>
                  <ClipLoader color="#fff" size={24} />
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span>
                    <MoveRight />
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
