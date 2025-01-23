'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Error = () => {
  const router = useRouter();

  return (
    <div className="absolute w-full h-screen inset-0 flex items-center justify-center">
      <div className="grid grid-cols-2 place-items-center px-[4rem]">
        <Image
          src="/images/not-found.svg"
          width={400}
          height={400}
          alt="Server Error"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold">This is our bad😟</h1>
          <p className="text-lg mt-2">
            We&apos;re sorry, but something went wrong. Our team has been
            notified and we&apos;ll get right on it.
          </p>
          <p className="text-lg mt-2">
            You can go{' '}
            <span
              className="underline underline-offset-4 hover:text-primary"
              role="button"
              onClick={() => router.back()}
            >
              back
            </span>{' '}
            to where you came from, or if you think something&apos;s wrong, feel
            free to contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
