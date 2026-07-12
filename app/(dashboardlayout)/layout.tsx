"use client";

import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar"

import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
    return <div>Loading...</div>;
  }

  const role = session?.user?.role;

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          {role === UserRole.ADMIN
            ? admin
            : role === UserRole.SELLER
            ? seller
            : user}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}