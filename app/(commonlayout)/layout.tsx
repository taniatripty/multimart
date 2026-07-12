import Navbar from '@/components/navbar';
import Footer from '@/components/shared/footer';
import React from 'react'

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
       <Navbar></Navbar> 
       {children}
       <Footer></Footer>
    </div>
  )
}
