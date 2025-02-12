"use client";

import useAuthUser from "@/app/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  CreditCardIcon,
  File,
  LayoutDashboardIcon,
} from "lucide-react";
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
      {user?.isAdmin === false && (
        <>
          <Link href="/dashboard/payments">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/payments" && "bg-gray-100 text-gray-900"
              )}
            >
              <CreditCard className="w-6 h-6 mr-2" />
              Payments
            </div>
          </Link>
          <Link href="/dashboard/documents">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/documents" && "bg-gray-100 text-gray-900"
              )}
            >
              <File className="w-6 h-6 mr-2" />
              Documents
            </div>
          </Link>
        </>
      )}
      {user?.isAdmin === true && (
        <>
          <Link href="/dashboard/view-all-payments">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/view-all-payments" &&
                  "bg-gray-100 text-gray-900"
              )}
            >
              <CreditCardIcon className="w-6 h-6 mr-2" />
              View All Payments
            </div>
          </Link>
          <Link href="/dashboard/view-all-documents">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/view-all-documents" &&
                  "bg-gray-100 text-gray-900"
              )}
            >
              <File className="w-6 h-6 mr-2" />
              View All Documents
            </div>
          </Link>
          <Link href="/dashboard/invoices">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/invoices" && "bg-gray-100 text-gray-900"
              )}
            >
              <File className="w-6 h-6 mr-2" />
              Invoices
            </div>
          </Link>
        </>
      )}
    </nav>
  );
}
