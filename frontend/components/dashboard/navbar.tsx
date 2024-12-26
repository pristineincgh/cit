'use client';

import { UserSchema } from '@/app/(auth)/types/schema';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth';
import { ChevronsUpDown, LogOut, Ticket, User } from 'lucide-react';
import { PiUsersThree } from 'react-icons/pi';
import { redirect } from 'next/navigation';

const NavBar = ({ user }: { user: UserSchema }) => {
  const { clearSession } = useAuthStore();

  // log out user
  const logout = () => {
    clearSession();

    redirect('/login');
  };

  return (
    <nav className="p-4 flex justify-between items-center border-b">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[16rem] justify-between focus-visible:ring-0 focus-visible:ring-offset-0 py-[1.5rem]"
            >
              <div className="flex flex-col items-start">
                <span>
                  {user?.firstname} {user?.lastname}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[16rem]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-x-4">
              <User className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-x-4">
              <Ticket className="w-4 h-4" />
              My Tickets
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-x-4"
              onClick={() => alert('Customers')}
            >
              <PiUsersThree width={16} />
              Customers
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-x-4"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
