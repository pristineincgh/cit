'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoveRight } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import AppLogo from '@/components/app-logo';
import {
  defaultLoginValues,
  LoginRequestInput,
  loginRequestSchema,
} from '@/lib/validations/auth_validations';
import { useLoginUser } from '@/services/auth_service/auth_mutations';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestInput>({
    mode: 'all',
    resolver: zodResolver(loginRequestSchema),
    defaultValues: defaultLoginValues,
  });

  const { mutate: loginUser, isPending } = useLoginUser();

  const onFormSubmit = (data: LoginRequestInput) => {
    loginUser(data);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-center">
        <AppLogo width={80} />
      </div>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-balance text-muted-foreground">
          Login to your CIT account
        </p>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col gap-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              placeholder="Enter your username"
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
    </div>
  );
};

export default LoginForm;
