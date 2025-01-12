'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { memo, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import components with proper loading states
const EmptyList = dynamic(
  () => import('./EmptyList'),
  {
    loading: () => (
      <div className="animate-pulse h-32 bg-slate-200 rounded" role="progressbar" />
    )
  }
);

const EnhancedLoader = dynamic(
  () => import('./LoaderBody'),
  {
    ssr: false
  }
);

const RoomCard = dynamic(
  () => import('./RoomCard'),
  {
    loading: () => (
      <div className="animate-pulse h-64 bg-slate-200 rounded" role="progressbar" />
    )
  }
);

// Memoized header section for better performance
const ListingHeader = memo(({ userName, onCreateNew }) => (
  <header className="flex items-center justify-between">
    <h2 className="font-bold text-3xl">
      Hello, {userName ?? 'Guest'}
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
));

ListingHeader.displayName = 'ListingHeader';

// Memoized room card with proper prop types
const MemoizedRoomCard = memo(({ room }) => (
  <RoomCard room={room} />
));

MemoizedRoomCard.displayName = 'MemoizedRoomCard';

// Memoized room grid for better performance
const RoomGrid = memo(({ rooms }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {rooms.map((room) => (
      <MemoizedRoomCard
        key={room.id || room._id}
        room={room}
      />
    ))}
  </div>
));

RoomGrid.displayName = 'RoomGrid';

// Custom hook for fetching room data with improved error handling
const useRoomList = (email) => {
  const [userRoomList, setUserRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/rooms?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      }

      const data = await response.json();
      setUserRoomList(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching room list:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { userRoomList, isLoading, error, refetch: fetchRooms };
};

// Error boundary component
const ErrorMessage = memo(({ message }) => (
  <div className="p-4 bg-red-50 text-red-700 rounded-md" role="alert">
    <p>Error loading rooms: {message}</p>
    <Button 
      onClick={() => window.location.reload()} 
      className="mt-2 text-sm"
      variant="outline"
    >
      Try Again
    </Button>
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';

const Listing = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const { userRoomList, isLoading, error, refetch } = useRoomList(email);

  if (isLoading) {
    return <EnhancedLoader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-8">
      <ListingHeader userName={user?.fullName} />
      
      {userRoomList?.length === 0 ? (
        <EmptyList />
      ) : (
        <section className="space-y-5">
          <h1 className="font-bold text-xl text-slate-700">
            AI Room Studio
          </h1>
          <RoomGrid rooms={userRoomList} />
        </section>
      )}
    </div>
  );
};

export default memo(Listing);