
"use client";

import { useSession } from "next-auth/react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { UserRole } from "@/lib/types";

export default function DashboardLayout({
  admin,
  seller,
  user,
}: {
  admin: React.ReactNode;
  seller: React.ReactNode;
  user: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const role = session?.user?.role as UserRole;

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset>
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 lg:hidden">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg font-semibold">Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="flex min-h-screen flex-1 flex-col p-4 md:p-6">
          {role === UserRole.ADMIN
            ? admin
            : role === UserRole.SELLER
              ? seller
              : user}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}