'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { memo, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import components with loading fallback
const EmptyList = dynamic(() => import('./EmptyList'), {
  loading: () => <div className="animate-pulse h-32 bg-slate-200 rounded" />
});

const EnhancedLoader = dynamic(() => import('./LoaderBody'), {
  ssr: false // Disable SSR for loader component
});

const RoomCard = dynamic(() => import('./RoomCard'), {
  loading: () => <div className="animate-pulse h-64 bg-slate-200 rounded" />
});

// Memoized room card component to prevent unnecessary re-renders
const MemoizedRoomCard = memo(({ room }) => (
  <RoomCard room={room} />
));

// Custom hook for fetching room data
const useRoomList = (email) => {
  const [userRoomList, setUserRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    if (!email) return;
    
    try {
      const response = await fetch(
        `/api/rooms?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store' // Disable caching for real-time data
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      setUserRoomList(data);
    } catch (error) {
      setError(error);
      console.error('Error fetching room list:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { userRoomList, isLoading, error };
};

const Listing = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const { userRoomList, isLoading } = useRoomList(email);

  if (isLoading) {
    return <EnhancedLoader />;
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="font-bold text-3xl">
          Hello, {user?.fullName ?? 'Guest'}
        </h2>
        <Link href="/dashboard/create-new">
          <Button 
            variant="primary" 
            className="bg-slate-700 text-white hover:bg-slate-800 transition-colors"
          >
            + Redesign Room
          </Button>
        </Link>
      </header>

      {userRoomList?.length === 0 ? (
        <EmptyList />
      ) : (
        <section className="space-y-5">
          <h1 className="font-bold text-xl text-slate-700">
            AI Room Studio
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {userRoomList.map((room) => (
              <MemoizedRoomCard 
                key={room.id || room._id} 
                room={room} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default memo(Listing);