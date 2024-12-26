'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { defaultValues, LoginInputSchema, schema } from '../types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginUser } from '../services/mutations';
import { ClipLoader } from 'react-spinners';
import Head from 'next/head';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputSchema>({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutate: loginUser, isPending } = useLoginUser();

  const onFormSubmit = (data: LoginInputSchema) => {
    loginUser(data);
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/images/app_logo.png" as="image" />
      </Head>

      <main className="h-screen grid grid-cols-2">
        <div className="bg-login-bg bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="flex flex-col items-center justify-center h-full relative z-50">
            <h1 className="text-5xl font-bold text-white">
              Customer Issues Tracker
            </h1>
            <p className="text-white text-xl">
              Track and manage customer issues efficiently.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-[30rem] p-8 rounded-lg shadow-lg">
            <div className="flex justify-center">
              <Image
                src="/images/app_logo.png"
                alt="CIT Logo"
                width={150}
                height={150}
              />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary">Welcome back</h1>
              <p className="">Sign in to your account to continue</p>
            </div>
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="mt-8 space-y-4"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  placeholder="Enter your password"
                />
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
                      <span>Continue</span>
                      <span>
                        <MoveRight />
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
