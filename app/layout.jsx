'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter from next/navigation
import localFont from 'next/font/local';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
 
import { usePathname } from 'next/navigation';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({ children }) {
  const router = useRouter();  // Initialize the router
  const pathname = usePathname();  // Get the current pathname

  useEffect(() => {
    // Redirect to '/rooms' if the current pathname is the root path (or any condition you'd like)
    if (pathname === '/') {
      router.push('/rooms');  // Programmatically navigate to '/rooms'
    }
  }, [pathname, router]);  // Depend on pathname to trigger effect on path changes

  const isLoginPage = pathname === '/login';  // Check if the current path is the login page

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="flex bg-white w-full  ">
          {/* Conditionally render Sidebar based on the pathname */}
          {!isLoginPage && <Sidebar />}

          
            {children}
          
        </main>
      </body>
    </html>
  );
}
