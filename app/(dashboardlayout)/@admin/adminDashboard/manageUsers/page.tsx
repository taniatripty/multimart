// "use client";

// import Image from "next/image";
// import { useEffect, useMemo, useState } from "react";
// import { Search, Shield, ShieldCheck } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   image: string;
//   role: "USER" | "SELLER" | "ADMIN";
// }

// export default function ManageUsersPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let ignore = false;

//     (async () => {
//       try {
//         const res = await fetch("/api/user", {
//           cache: "no-store",
//         });

//         const result = await res.json();

//         if (!ignore && res.ok) {
//           setUsers(result.data);
//         }

//         if (!ignore && !res.ok) {
//           toast.error(result.message);
//         }
//       } catch {
//         if (!ignore) {
//           toast.error("Failed to load users.");
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false);
//         }
//       }
//     })();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   const filteredUsers = useMemo(() => {
//     return users.filter(
//       (user) =>
//         user.name
//           .toLowerCase()
//           .includes(search.toLowerCase()) ||
//         user.email
//           .toLowerCase()
//           .includes(search.toLowerCase())
//     );
//   }, [users, search]);

//   const changeRole = async (
//     id: string,
//     role: "USER" | "ADMIN"
//   ) => {
//     try {
//       const res = await fetch(`/api/user/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ role }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.message);
//         return;
//       }

//       toast.success(result.message);

//       setUsers((prev) =>
//         prev.map((user) =>
//           user._id === id
//             ? { ...user, role }
//             : user
//         )
//       );
//     } catch {
//       toast.error("Failed to update role.");
//     }
//   };

//   return (
//     <section className="p-6">
//       <Card>
//         <CardContent className="space-y-6 p-6">

//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold">
//                 Manage Users
//               </h1>

//               <p className="text-muted-foreground">
//                 Manage user roles.
//               </p>
//             </div>

//             <div className="relative w-72">
//               <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

//               <Input
//                 placeholder="Search..."
//                 className="pl-10"
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(e.target.value)
//                 }
//               />
//             </div>
//           </div>

//           <div className="rounded-lg border">

//             <Table>

//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>

//                 {loading ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={3}
//                       className="py-8 text-center"
//                     >
//                       Loading...
//                     </TableCell>
//                   </TableRow>
//                 ) : filteredUsers.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={3}
//                       className="py-8 text-center"
//                     >
//                       No users found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <TableRow key={user._id}>

//                       <TableCell>

//                         <div className="flex items-center gap-3">

//                           <Image
//                             src={user.image}
//                             alt={user.name}
//                             width={45}
//                             height={45}
//                             className="rounded-full"
//                           />

//                           <div>
//                             <p className="font-medium">
//                               {user.name}
//                             </p>

//                             <p className="text-sm text-muted-foreground">
//                               {user.email}
//                             </p>
//                           </div>

//                         </div>

//                       </TableCell>

//                       <TableCell>

//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-medium ${
//                             user.role === "ADMIN"
//                               ? "bg-green-100 text-green-700"
//                               : user.role === "SELLER"
//                               ? "bg-blue-100 text-blue-700"
//                               : "bg-gray-100 text-gray-700"
//                           }`}
//                         >
//                           {user.role}
//                         </span>

//                       </TableCell>

//                       <TableCell>

//                         {user.role === "SELLER" ? (
//                           <span className="text-muted-foreground text-sm">
//                             Seller
//                           </span>
//                         ) : user.role === "ADMIN" ? (
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() =>
//                               changeRole(user._id, "USER")
//                             }
//                           >
//                             <Shield className="mr-2 h-4 w-4" />
//                             Remove Admin
//                           </Button>
//                         ) : (
//                           <Button
//                             size="sm"
//                             onClick={() =>
//                               changeRole(user._id, "ADMIN")
//                             }
//                           >
//                             <ShieldCheck className="mr-2 h-4 w-4" />
//                             Make Admin
//                           </Button>
//                         )}

//                       </TableCell>

//                     </TableRow>
//                   ))
//                 )}

//               </TableBody>

//             </Table>

//           </div>

//         </CardContent>
//       </Card>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: "user" | "seller" | "admin";
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch("/api/user", {
          cache: "no-store",
        });

        const result = await res.json();

        if (!ignore && res.ok) {
          setUsers(result.data);
        }

        if (!ignore && !res.ok) {
          toast.error(result.message);
        }
      } catch {
        if (!ignore) {
          toast.error("Failed to load users.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const changeRole = async (
    id: string,
    role: "user" | "admin"
  ) => {
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role } : user
        )
      );
    } catch {
      toast.error("Failed to update role.");
    }
  };

  const renderRoleAction = (user: User) => {
    // SELLER: no admin toggle
    if (user.role === "seller") {
      return (
        <span className="text-muted-foreground text-sm">
          Seller
        </span>
      );
    }

    // ADMIN: show Remove Admin (downgrade to USER)
    if (user.role === "admin") {
      return (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => changeRole(user._id, "user")}
        >
          <Shield className="mr-2 h-4 w-4" />
          Remove Admin
        </Button>
      );
    }

    // USER: show Make Admin (upgrade to ADMIN)
    return (
      <Button
        size="sm"
        onClick={() => changeRole(user._id, "admin")}
      >
        <ShieldCheck className="mr-2 h-4 w-4" />
        Make Admin
      </Button>
    );
  };

  return (
    <section className="p-6">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Users</h1>
              <p className="text-muted-foreground">
                Manage user roles.
              </p>
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={45}
                            height={45}
                            className="rounded-full"
                          />

                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-green-100 text-green-700"
                              : user.role === "seller"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>

                      <TableCell>
                        {renderRoleAction(user)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}