'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoveRight } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { defaultValues, LoginInputSchema, loginSchema } from '../types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginUser } from '../services/mutations';
import Link from 'next/link';
import AppLogo from '@/components/app-logo';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputSchema>({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const { mutate: loginUser, isPending } = useLoginUser();

  const onFormSubmit = (data: LoginInputSchema) => {
    loginUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 md:p-8">
      <div className="flex justify-center">
        <AppLogo width={80} />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">
            Login to your CIT account
          </p>
        </div>

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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
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

        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="#" className="underline underline-offset-4">
            Contact support
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
