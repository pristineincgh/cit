import Head from 'next/head';
import LoginForm from '../_components/login-form';
import AppLogo from '@/components/app-logo';

export default function Login() {
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
              <AppLogo />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary">Welcome back</h1>
              <p className="">Sign in to your account to continue</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </main>
    </>
  );
}
