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
    <form onSubmit={handleSubmit(onFormSubmit)} className="mt-8 space-y-4">
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
  );
};

export default LoginForm;
