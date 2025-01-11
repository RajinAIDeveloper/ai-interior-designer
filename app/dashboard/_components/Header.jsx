'use client';

import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { UserDetailContext } from '../../../app/_context/UserDetailContext';
import { Button } from '../../../components/ui/button';
import LoadingHeader from './HeaderLoader';
import Link from 'next/link';

const Header = () => {
  const { userDetail } = useContext(UserDetailContext);
  const { isLoaded, isSignedIn } = useUser();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle initial loading state
  useEffect(() => {
    if (isLoaded) {
      setIsInitialLoad(false);
    }
  }, [isLoaded]);

  // Show loading state only during initial load
  if (isInitialLoad) {
    return <LoadingHeader />;
  }

  const LogoSection = () => (
    <Link href="/" className="flex gap-5 items-center p-4 hover:opacity-90 transition-opacity">
      <Image
        src="/logo.svg"
        alt="Interior Design AI Logo"
        width={40}
        height={40}
        priority
      />
      <h1 className="text-2xl font-bold">Interior Design AI</h1>
    </Link>
  );

  const NavigationButtons = () => (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" className="text-xl rounded-full">
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard/buy-credits">
        <Button variant="ghost" className="text-xl rounded-full">
          Buy More Credits
        </Button>
      </Link>
    </>
  );

  const CreditsDisplay = () => (
    <div className="flex gap-2 p-1 items-center bg-slate-300 rounded-full px-5">
      <Image
        src="/credit.svg"
        alt="Credits"
        width={20}
        height={20}
      />
      <h2>{userDetail?.credits || 0}</h2>
    </div>
  );

  return (
    <header className="flex justify-between items-center p-5 shadow-md">
      <LogoSection />
      
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <NavigationButtons />
            <div className="flex gap-7 items-center p-4">
              <CreditsDisplay />
              <UserButton afterSignOutUrl="/" />
            </div>
          </>
        ) : (
          <Link href='/sign-in'>

          <Button variant="default" className="rounded-full">
              Sign In
            </Button>
          
          </Link>
            
          
        )}
      </div>
    </header>
  );
};

export default Header;