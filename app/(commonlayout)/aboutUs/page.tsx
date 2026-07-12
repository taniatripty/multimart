// import Image from "next/image";
// import {
//   Award,
//   Globe,
//   ShieldCheck,
//   ShoppingBag,
//   Truck,
//   Users,
// } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// const features = [
//   {
//     icon: ShoppingBag,
//     title: "Thousands of Products",
//     description:
//       "Explore a wide collection of products from trusted brands and verified sellers.",
//   },
//   {
//     icon: Truck,
//     title: "Fast Delivery",
//     description:
//       "Quick and reliable shipping with nationwide delivery coverage.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Secure Shopping",
//     description:
//       "Protected payments, verified vendors, and secure transactions.",
//   },
//   {
//     icon: Award,
//     title: "Premium Quality",
//     description:
//       "Every product is carefully selected to ensure the best customer experience.",
//   },
// ];

// const stats = [
//   {
//     value: "50K+",
//     label: "Happy Customers",
//   },
//   {
//     value: "10K+",
//     label: "Products",
//   },
//   {
//     value: "500+",
//     label: "Trusted Sellers",
//   },
//   {
//     value: "64",
//     label: "District Coverage",
//   },
// ];

// const team = [
//   {
//     name: "John Smith",
//     role: "Founder & CEO",
//     image: "https://i.pravatar.cc/300?img=12",
//   },
//   {
//     name: "Sarah Johnson",
//     role: "Operations Manager",
//     image: "https://i.pravatar.cc/300?img=32",
//   },
//   {
//     name: "Michael Lee",
//     role: "Marketing Lead",
//     image: "https://i.pravatar.cc/300?img=15",
//   },
// ];

// export default function AboutPage() {
//   return (
//     <main>
//       {/* Hero */}
//       <section className="bg-slate-900 py-24 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <span className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400">
//             About MultiMart
//           </span>

//           <h1 className="mt-6 text-5xl font-bold md:text-6xl">
//             Shopping Made Easy
//           </h1>

//           <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
//             MultiMart is a modern multi-vendor e-commerce platform where
//             customers discover quality products while trusted sellers grow their
//             businesses.
//           </p>
//         </div>
//       </section>

//       {/* Story */}
//       <section className="container mx-auto px-4 py-20">
//         <div className="grid items-center gap-12 lg:grid-cols-2">
//           <div>
//             <Image
//               src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
//               alt="About MultiMart"
//               width={700}
//               height={500}
//               className="rounded-2xl object-cover shadow-xl"
//             />
//           </div>

//           <div>
//             <h2 className="text-4xl font-bold text-slate-900">
//               Our Story
//             </h2>

//             <p className="mt-6 text-slate-600 leading-8">
//               MultiMart was built with one mission—connecting customers with
//               trusted sellers through a secure and user-friendly marketplace.
//               We believe online shopping should be simple, transparent, and
//               enjoyable for everyone.
//             </p>

//             <p className="mt-4 text-slate-600 leading-8">
//               Our platform empowers local businesses to reach more customers
//               while providing shoppers with competitive prices, authentic
//               products, and exceptional customer service.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Mission */}
//       <section className="bg-slate-50 py-20">
//         <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2">
//           <Card className="border-none shadow-lg">
//             <CardContent className="p-8">
//               <Globe className="mb-5 h-12 w-12 text-amber-500" />

//               <h3 className="text-3xl font-bold">
//                 Our Mission
//               </h3>

//               <p className="mt-4 text-slate-600 leading-8">
//                 To create a trusted online marketplace that connects buyers and
//                 sellers while providing secure, affordable, and convenient
//                 shopping experiences.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-none shadow-lg">
//             <CardContent className="p-8">
//               <Users className="mb-5 h-12 w-12 text-blue-600" />

//               <h3 className="text-3xl font-bold">
//                 Our Vision
//               </h3>

//               <p className="mt-4 text-slate-600 leading-8">
//                 To become one of the leading e-commerce platforms by delivering
//                 innovation, trust, and outstanding customer satisfaction.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="container mx-auto px-4 py-20">
//         <div className="text-center">
//           <h2 className="text-4xl font-bold">
//             Why Choose MultiMart
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl text-slate-600">
//             We focus on delivering an exceptional shopping experience through
//             innovation, reliability, and customer satisfaction.
//           </p>
//         </div>

//         <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {features.map((feature) => (
//             <Card
//               key={feature.title}
//               className="border-none shadow-md transition hover:-translate-y-2 hover:shadow-xl"
//             >
//               <CardContent className="p-8 text-center">
//                 <feature.icon className="mx-auto h-12 w-12 text-amber-500" />

//                 <h3 className="mt-5 text-xl font-semibold">
//                   {feature.title}
//                 </h3>

//                 <p className="mt-3 text-sm leading-7 text-slate-600">
//                   {feature.description}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Stats */}
//       <section className="bg-slate-900 py-20 text-white">
//         <div className="container mx-auto grid gap-10 px-4 text-center sm:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat) => (
//             <div key={stat.label}>
//               <h2 className="text-5xl font-bold text-amber-400">
//                 {stat.value}
//               </h2>

//               <p className="mt-3 text-slate-300">
//                 {stat.label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Team */}
//       <section className="container mx-auto px-4 py-20">
//         <div className="text-center">
//           <h2 className="text-4xl font-bold">
//             Meet Our Team
//           </h2>

//           <p className="mx-auto mt-4 max-w-xl text-slate-600">
//             Passionate professionals committed to building the best shopping
//             experience.
//           </p>
//         </div>

//         <div className="mt-14 grid gap-8 md:grid-cols-3">
//           {team.map((member) => (
//             <Card
//               key={member.name}
//               className="overflow-hidden border-none shadow-lg"
//             >
//               <Image
//                 src={member.image}
//                 alt={member.name}
//                 width={400}
//                 height={350}
//                 className="h-80 w-full object-cover"
//               />

//               <CardContent className="p-6 text-center">
//                 <h3 className="text-xl font-semibold">
//                   {member.name}
//                 </h3>

//                 <p className="mt-2 text-slate-500">
//                   {member.role}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-amber-500 py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-4xl font-bold text-slate-900">
//             Ready to Start Shopping?
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl text-slate-800">
//             Join thousands of happy customers and discover amazing products from
//             trusted sellers across Bangladesh.
//           </p>

//           <Button
//             asChild
//             size="lg"
//             className="mt-8 bg-slate-900 hover:bg-slate-800"
//           >
//             <Link href="/products">
//               Explore Products
//             </Link>
//           </Button>
//         </div>
//       </section>
//     </main>
//   );
// }

import Image from "next/image";
import { Globe, ShieldCheck, ShoppingBag, Truck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  { icon: ShoppingBag, title: "Thousands of Products", desc: "Wide collection from trusted sellers." },
  { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable nationwide shipping." },
  { icon: ShieldCheck, title: "Secure Shopping", desc: "Protected payments and verified vendors." },
];

const stats = [
  { value: "50K+", label: "Customers" },
  { value: "10K+", label: "Products" },
  { value: "500+", label: "Sellers" },
];

const team = [
  { name: "John Smith", role: "Founder & CEO", image: "https://i.pravatar.cc/300?img=12" },
  { name: "Sarah Johnson", role: "Operations Manager", image: "https://i.pravatar.cc/300?img=32" },
  { name: "Michael Lee", role: "Marketing Lead", image: "https://i.pravatar.cc/300?img=15" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      {/* About */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-slate-900">About MultiMart</h1>
        <p className="mt-6 text-lg text-slate-600">
          A modern multi-vendor marketplace connecting customers with quality products while empowering trusted sellers across Bangladesh.
        </p>
      </div>

      {/* Story */}
      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
          alt="Our Story"
          width={600}
          height={400}
          className="rounded-xl object-cover shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Our Story</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            MultiMart was built to connect customers with trusted sellers through a secure marketplace. We empower local businesses while providing shoppers with competitive prices, authentic products, and exceptional service.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <Globe className="mb-3 h-10 w-10 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-600">Our Mission</h3>
            <p className="mt-2 text-slate-600">Create a trusted marketplace with secure, affordable shopping experiences.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <Users className="mb-3 h-10 w-10 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-600">Our Vision</h3>
            <p className="mt-2 text-slate-600">Become a leading e-commerce platform through innovation and trust.</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Why Choose Us</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-none shadow-sm">
              <CardContent className="p-5 text-center">
                <f.icon className="mx-auto h-10 w-10 text-amber-600" />
                <h3 className="mt-3 font-semibold text-amber-600">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-3 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl font-bold text-amber-600">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">Our Team</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <Card key={m.name} className="overflow-hidden border-none shadow-md">
              <Image src={m.image} alt={m.name} width={400} height={280} className="h-56 w-full object-cover" />
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-slate-900">{m.name}</h3>
                <p className="text-sm text-amber-600 font-medium">{m.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
       <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none bg-slate-900 text-white shadow-xl">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <h2 className="text-4xl font-bold">
                Ready to Explore MultiMart?
              </h2>

              <p className="mt-4 max-w-2xl text-slate-300">
                Discover thousands of products from trusted sellers and enjoy a
                secure, convenient, and enjoyable online shopping experience.
              </p>

              <Button
                asChild
                size="lg"
                className="mt-8 bg-amber-500 text-slate-900 hover:bg-amber-400"
              >
                <Link href="/products">
                  Explore Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}