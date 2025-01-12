'use client';

import React, { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import useUserStore from '@/store/useUserStore';
import { Button } from '../../../components/ui/button';
import LoadingHeader from './HeaderLoader';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';


const LogoSection = memo(() => (
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
));

LogoSection.displayName = 'LogoSection';

const NavigationButtons = memo(({ isMobile = false }) => {
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
});

NavigationButtons.displayName = 'NavigationButtons';

const CreditsDisplay = memo(() => {
  const credits = useUserStore(state => state.userDetail?.credits ?? 0);
  
  return (
    <div className="flex gap-2 p-1 items-center bg-slate-300 rounded-full px-3 md:px-5">
      <Image
        src="/credit.svg"
        alt="Credits"
        width={16}
        height={16}
        className="w-4 h-4 md:w-5 md:h-5"
      />
      <h2 className="text-sm md:text-base">{credits}</h2>
    </div>
  );
});


CreditsDisplay.displayName = 'CreditsDisplay';

const MobileMenu = memo(({ isOpen, isSignedIn }) => (
  <div 
    className={`
      fixed top-16 right-0 w-64 bg-white shadow-lg rounded-bl-lg
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      md:hidden mobile-menu z-50
    `}
  >
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
));

MobileMenu.displayName = 'MobileMenu';

const Header = () => {
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

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMobileMenuOpen]);

  if (isInitialLoad) {
    return <LoadingHeader />;
  }

  return (
    <header className="flex justify-between items-center p-2 md:p-5 shadow-md relative bg-white">
      <LogoSection />
      
      <div className="flex items-center gap-2 md:gap-4">
        {isSignedIn ? (
          <>
            <NavigationButtons />
            <div className="hidden md:flex gap-4 md:gap-7 items-center p-2 md:p-4">
              <CreditsDisplay />
            </div>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 md:w-10 md:h-10"
                }
              }}
            />
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
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} isSignedIn={isSignedIn} />
    </header>
  );
};

export default memo(Header);