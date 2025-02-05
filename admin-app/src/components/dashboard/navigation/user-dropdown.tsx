"use client";

import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const UserDropDown = () => {
  const { session, clearSession } = useAuthStore();
  const user = session?.user;

  const router = useRouter();

  // log out user
  const logout = () => {
    clearSession();

    router.push("/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-[16rem] justify-between focus-visible:ring-0 focus-visible:ring-offset-0 py-[1.5rem]"
          >
            <div className="flex flex-col items-start">
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[16rem]">
          <DropdownMenuItem className="flex items-center gap-x-4">
            <UserCog className="w-4 h-4" />
            Account Settings
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
    </>
  );
};

export default UserDropDown;
