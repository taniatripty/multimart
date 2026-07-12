// "use client"

// import * as React from "react"

// import { NavDocuments } from "@/components/nav-documents"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"
// import {UserRole} from "@/lib/types"
// import { adminRoutes } from "@/routes/AdminRoutes"
// import { sellerRoutes } from "@/routes/SellerRoutes"
// import { userRoutes } from "@/routes/UserRoutes"
// const data = {
  
 
//   documents: [
//     {
//       name: "Data Library",
//       url: "#",
//       icon: (
//         <DatabaseIcon
//         />
//       ),
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: (
//         <FileChartColumnIcon
//         />
//       ),
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: (
//         <FileIcon
//         />
//       ),
//     },
//   ],
// }
// let routes = [];

//   switch (user.role) {
//     case UserRole.ADMIN:
//       routes = adminRoutes;
//       break;
//     case UserRole.SELLER:
//       routes = sellerRoutes;
//       break;
//     case UserRole.USER:
//       routes = userRoutes;
//       break;
//     default:
//       routes = [];
//   }

// export function AppSidebar({user, ...props }:{
//   user: { role: string };
// } & React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar  {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
             
//             >
//               <CommandIcon className="size-5!" />
//               <span className="text-base font-semibold">Acme Inc.</span>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
       
//         <NavDocuments items={data.documents} />
       
//       </SidebarContent>
//       <SidebarFooter>
       
//       </SidebarFooter>
//     </Sidebar>
//   )
// }

"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Command,
  LogOut,
  User,
  Mail,
  Home,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart3,
  FileText,
  CreditCard,
  HelpCircle,
  Shield,
  Store,
  Tag,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { UserRole } from "@/lib/types";
import { adminRoutes } from "@/routes/AdminRoutes";
import { sellerRoutes } from "@/routes/SellerRoutes";
import { userRoutes } from "@/routes/UserRoutes";

// Helper: default icon per route title
function getIconForRoute(title: string, groupTitle: string): LucideIcon {
  const t = title.toLowerCase();

  if (t.includes("dashboard") || t.includes("home")) return LayoutDashboard;
  if (t.includes("orders")) return ShoppingCart;
  if (t.includes("product") || t.includes("item")) return Package;
  if (t.includes("user") || t.includes("customer")) return Users;
  if (t.includes("setting")) return Settings;
  if (t.includes("report") || t.includes("analytics") || t.includes("stat"))
    return BarChart3;
  if (t.includes("payment") || t.includes("billing") || t.includes("invoice"))
    return CreditCard;
  if (t.includes("help") || t.includes("support")) return HelpCircle;
  if (t.includes("profile")) return User;
  if (t.includes("store") || t.includes("shop")) return Store;
  if (t.includes("category") || t.includes("tag")) return Tag;
  if (t.includes("admin") || t.includes("role") || t.includes("permission"))
    return Shield;
  if (t.includes("document") || t.includes("page") || t.includes("content"))
    return FileText;

  const g = groupTitle.toLowerCase();
  if (g.includes("main") || g.includes("general")) return Home;
  if (g.includes("store") || g.includes("seller")) return Store;
  if (g.includes("admin")) return Shield;

  return Home;
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const role = session?.user?.role;

  let routes = userRoutes;

  if (role === UserRole.ADMIN) {
    routes = adminRoutes;
  } else if (role === UserRole.SELLER) {
    routes = sellerRoutes;
  }

  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Sidebar {...props} className="border-r">
      {/* Header */}
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight">
              MultiMart
            </span>
            <span className="text-xs text-muted-foreground">
              {role?.toLowerCase() ?? "user"} dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const Icon = getIconForRoute(item.title, group.title);

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                      >
                        <Link href={item.url} className="flex w-full items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitial}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <h4 className="truncate text-sm font-semibold">{userName}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="truncate text-xs text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          className="mt-3 w-full justify-start gap-2"
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}