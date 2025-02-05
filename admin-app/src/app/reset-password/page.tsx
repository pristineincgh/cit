import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Reset Password",
};
const ResetPassword = () => {
  return (
    <>
      <Head>
        <link rel="preload" href="/images/app_logo.png" as="image" />
      </Head>

      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-[52rem]">
          <div className="w-full max-w-sm md:max-w-[52rem]">
            <div className="flex flex-col gap-6">
              <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                  <div className="relative hidden md:block">
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <Image
                      src="/images/login-bg.jpg"
                      alt="Image"
                      className="object-cover"
                      fill
                      priority
                    />
                  </div>
                  <ResetPasswordForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
