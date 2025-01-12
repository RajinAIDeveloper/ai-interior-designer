'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { memo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import useListingStore from '@/store/useListingStore';

const EmptyList = dynamic(() => import('./EmptyList'), {
  loading: () => <div className="animate-pulse h-32 bg-slate-200 rounded" />
});

const EnhancedLoader = dynamic(() => import('./LoaderBody'), { ssr: false });

const RoomCard = dynamic(() => import('./RoomCard'), {
  loading: () => <div className="animate-pulse h-64 bg-slate-200 rounded" />
});

const ListingHeader = memo(({ userName }) => (
  <header className="flex items-center justify-between">
    <h2 className="font-bold text-3xl">Hello, {userName ?? 'Guest'}</h2>
    <Link href="/dashboard/create-new">
      <Button className="bg-slate-700 text-white hover:bg-slate-800 transition-colors">
        + Redesign Room
      </Button>
    </Link>
  </header>
));

const RoomGrid = memo(({ rooms }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {rooms.map((room) => (
      <RoomCard key={room.id || room._id} room={room} />
    ))}
  </div>
));

const Listing = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  
  // Simplified store selectors
  const listings = useListingStore(state => state.listings);
  const isLoading = useListingStore(state => state.isLoading);
  const fetchListings = useListingStore(state => state.fetchListings);

  useEffect(() => {
    if (email) {
      fetchListings(email);
    }
  }, [email]); // Only depend on email

  if (isLoading) {
    return <EnhancedLoader />;
  }

  return (
    <div className="space-y-8">
      <ListingHeader userName={user?.fullName} />
      
      {!listings?.length ? (
        <EmptyList />
      ) : (
        <section className="space-y-5">
          <h1 className="font-bold text-xl text-slate-700">AI Room Studio</h1>
          <RoomGrid rooms={listings} />
        </section>
      )}
    </div>
  );
};

export default memo(Listing);