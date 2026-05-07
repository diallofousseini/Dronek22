'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ['/admin/login', '/admin/forgot-password'];
    if (!loading && !user && !publicRoutes.includes(pathname)) {
      router.replace('/admin/login');
    } else if (!loading && user && pathname === '/admin/login') {
      router.replace('/admin');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5]">
        <div className="w-8 h-8 border-4 border-dronek-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const publicRoutes = ['/admin/login', '/admin/forgot-password'];

  // Allow access to public admin pages if not authenticated
  if (!user && publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // If authenticated, render children (redirect is handled by useEffect)
  if (user && pathname === '/admin/login') {
    return null; // Prevent flashing the login page while redirecting
  }

  return <>{children}</>;
}
