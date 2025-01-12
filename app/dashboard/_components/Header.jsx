'use client';

import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import { UserDetailContext } from '../../../app/_context/UserDetailContext';
import { Button } from '../../../components/ui/button';
import LoadingHeader from './HeaderLoader';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { userDetail } = useContext(UserDetailContext);
  const { isLoaded, isSignedIn } = useUser();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle initial loading state
  useEffect(() => {
    if (isLoaded) {
      setIsInitialLoad(false);
    }
  }, [isLoaded]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  if (isInitialLoad) {
    return <LoadingHeader />;
  }

  const LogoSection = () => (
    <Link href="/" className="flex gap-2 md:gap-5 items-center p-2 md:p-4 hover:opacity-90 transition-opacity">
      <Image
        src="/logo.svg"
        alt="Interior Design AI Logo"
        width={32}
        height={32}
        className="w-8 h-8 md:w-10 md:h-10"
        priority
      />
      <h1 className="text-lg md:text-2xl font-bold">Interior Design AI</h1>
    </Link>
  );

  const NavigationButtons = ({ isMobile = false }) => {
    const buttonClass = isMobile
      ? "w-full text-left px-4 py-3 hover:bg-slate-100"
      : "text-xl rounded-full hidden md:block";

    return (
      <>
        <Link href="/dashboard">
          <Button variant="ghost" className={buttonClass}>
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/buy-credits">
          <Button variant="ghost" className={buttonClass}>
            Buy More Credits
          </Button>
        </Link>
      </>
    );
  };

  const CreditsDisplay = () => (
    <div className="flex gap-2 p-1 items-center bg-slate-300 rounded-full px-3 md:px-5">
      <Image
        src="/credit.svg"
        alt="Credits"
        width={16}
        height={16}
        className="w-4 h-4 md:w-5 md:h-5"
      />
      <h2 className="text-sm md:text-base">{userDetail?.credits || 0}</h2>
    </div>
  );

  const MobileMenu = () => (
    <div className={`
      fixed top-16 right-0 w-64 bg-white shadow-lg rounded-bl-lg
      transform transition-transform duration-200 ease-in-out
      ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      md:hidden mobile-menu z-50
    `}>
      <div className="py-2">
        {isSignedIn ? (
          <>
            <NavigationButtons isMobile={true} />
            <div className="px-4 py-3 border-t">
              <CreditsDisplay />
            </div>
          </>
        ) : (
          <Link href='/sign-in' className="block px-4 py-3">
            <Button variant="default" className="w-full">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <header className="flex justify-between items-center p-2 md:p-5 shadow-md relative">
      <LogoSection />
      
      <div className="flex items-center gap-2 md:gap-4">
        {isSignedIn ? (
          <>
            <NavigationButtons />
            <div className="hidden md:flex gap-4 md:gap-7 items-center p-2 md:p-4">
              <CreditsDisplay />
            </div>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <Link href='/sign-in' className="hidden md:block">
            <Button variant="default" className="rounded-full">
              Sign In
            </Button>
          </Link>
        )}
        
        <Button
          variant="ghost"
          className="p-2 md:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      <MobileMenu />
    </header>
  );
};

export default Header;