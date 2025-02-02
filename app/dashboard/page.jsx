'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import RoomCard from './_components/RoomCard';
import EmptyList from './_components/EmptyList';

const ListingPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyUser = async () => {
    try {
      if (!user) return null;

      // First try to verify if user exists
      try {
        const verifyResponse = await axios.post('/api/verify-user', { 
          user: {
            primaryEmailAddress: user.primaryEmailAddress,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
          }
        });
        
        if (verifyResponse.data?.result) {
          setUserDetail(verifyResponse.data.result);
          return verifyResponse.data.result;
        }
      } catch (verifyError) {
        // If user not found (404), try to create them
        if (verifyError.response?.status === 404) {
          try {
            const createUserResponse = await axios.post('/api/add-user-to-db', {
              user: {
                email: user.primaryEmailAddress?.emailAddress,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                imageUrl: user.imageUrl
              }
            });

            if (createUserResponse.data?.result) {
              setUserDetail(createUserResponse.data.result);
              return createUserResponse.data.result;
            }
          } catch (createError) {
            console.error('Error creating user:', createError);
            throw createError;
          }
        } else {
          throw verifyError;
        }
      }
      
      setError('Failed to verify or create user');
      return null;
    } catch (error) {
      console.error('Error in user verification process:', error);
      setError(error.response?.data?.error || 'Failed to verify or create user');
      return null;
    }
  };

  const fetchListings = async (userDetail) => {
    try {
      const response = await axios.get(`/api/rooms?email=${encodeURIComponent(userDetail.email)}`);
      if (response.data) {
        setListings(response.data);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
      setListings([]);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!isLoaded) return;

      setLoading(true);
      setError(null);

      try {
        if (isSignedIn && user) {
          const verifiedUser = await verifyUser();
          if (verifiedUser && !verifiedUser.isNewUser) {
            await fetchListings(verifiedUser);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Please sign in to view your designs
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!userDetail) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Unable to load user details. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (listings.length === 0) {
    return <EmptyList />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your AI Interior Designs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default ListingPage;