"use client";

import useAuthUser from "@/app/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import { CreditCard, LayoutDashboardIcon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const user = useAuthUser();
  const path = usePathname();

  return (
    <nav className="grid items-start gap-2">
      <Link href="/dashboard">
        <div
          className={cn(
            "flex items-center px-3 py-2 rounded-md",
            path === "/dashboard" && "bg-gray-100 text-gray-900"
          )}
        >
          <LayoutDashboardIcon className="w-6 h-6 mr-2" />
          Dashboard
        </div>
      </Link>
      <Link href="/dashboard/tasks">
        <div
          className={cn(
            "flex items-center px-3 py-2 rounded-md",
            path === "/dashboard/tasks" && "bg-gray-100 text-gray-900"
          )}
        >
          <CreditCard className="w-6 h-6 mr-2" />
          Todos
        </div>
      </Link>
      {user?.isAdmin === true && (
        <>
          <Link href="/dashboard/users">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/users" && "bg-gray-100 text-gray-900"
              )}
            >
              <Users className="w-6 h-6 mr-2" />
              View All User
            </div>
          </Link>
        </>
      )}
    </nav>
  );
}
