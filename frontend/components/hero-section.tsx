'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const router = useRouter();

  return (
    <div className="h-screen p-5 grid justify-center place-content-between relative overflow-hidden bg-background">
      <div className="mt-24">
        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Track and resolve
            <span className="block text-muted-foreground mt-2">
              customer issues faster
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Efficiently manage customer issues and boost team productivity with
            our comprehensive tracking system.
          </p>
          <div className="mt-8 flex justify-center gap-5">
            <Button className="text-base">Request Access</Button>
            <Button
              variant="outline"
              className="text-base"
              onClick={() => router.push('/login')}
            >
              Login to account
            </Button>
          </div>
        </div>
      </div>

      <footer className="flex gap-[18rem] items-center text-sm">
        <p>&copy; 2024 Customer Issues Tracker. All rights reserved.</p>
        <p>Built with ❤️ by Pristine Inc.</p>
        <div className="flex gap-2 items-center">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>{' '}
          |
          <Link href="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>{' '}
          |
          <Link href="/contact-us" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
