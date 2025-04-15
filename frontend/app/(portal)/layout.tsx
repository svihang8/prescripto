"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import { useRouter } from "next/navigation";

export default function PortalLayout({children,}: {children: React.ReactNode;}) {
  const router = useRouter();
  
  useEffect(() => {
    AOS.init({
          once: true,
          disable: "phone",
          duration: 700,
          easing: "ease-out-cubic",
        });

    const token = localStorage.getItem('token');

    if(!token) {
      router.push('/signin');
    }

  }, [router]);

  return (
    <>
      <main className="grow">{children}</main>
    </>
  );
}
