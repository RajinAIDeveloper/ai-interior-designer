'use client'

import React, { useState, useEffect } from 'react'
import { uploadImage } from "../../supabase/client";
import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import Additional from './_components/Additional'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import LoadingOverlay from './_components/Loading'
import AIOutputDialog from './_components/AIOutputDialog';
import LoadingBody from './_components/BodyLoader';
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';

const CreateNewRoomDesign = () => {
  const router = useRouter();
  const { user } = useUser();
  
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState(null);
  const [originalImage, setOriginalImage] = useState();
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const verifyUserAndCheckCredits = async () => {
      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        const response = await axios.post('/api/verify-user', {
          user: {
            primaryEmailAddress: user.primaryEmailAddress,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
          }
        });

        if (response.data?.result) {
          const userData = response.data.result;
          setUserDetail(userData);

          if (userData.credits === 0) {
            toast.error('You need credits to generate designs.');
            router.replace('/dashboard/buy-credits');
          }
          return;
        }
      } catch (error) {
        if (error.response?.status === 404) {
          try {
            const createResponse = await axios.post('/api/add-user-to-db', {
              user: {
                email: user.primaryEmailAddress?.emailAddress,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                imageUrl: user.imageUrl
              }
            });
            
            if (createResponse.data?.result) {
              setUserDetail(createResponse.data.result);
              router.replace('/dashboard/buy-credits');
            }
          } catch (createError) {
            console.error('Error creating user:', createError);
            toast.error('Failed to initialize user account');
          }
        } else {
          console.error('Error verifying user:', error);
          toast.error('Failed to load user details');
        }
      }
    };

    verifyUserAndCheckCredits();
  }, [user, router]);

  const onHandleFileSelected = (value, fileType) => {
    setFormData(prev => ({...prev, [fileType]: value}));
  }

  const GenerateAiImage = async () => {
    if (!formData.image || !formData.roomType || !formData.designType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      const { imageUrl, error } = await uploadImage({
        file: formData.image,
        bucket: "room_images",
      });

      if (error) throw new Error('Failed to upload image');

      setOriginalImage(imageUrl);

      const result = await axios.post('/api/redesign-room', {
        imageUrl: imageUrl,
        roomType: formData.roomType,
        designType: formData.designType,
        additional: formData.additional,
        userEmail: user.primaryEmailAddress?.emailAddress
      });
      
      setAiOutputImage(result.data.result);

      if (result.data.success) {
        setUserDetail(prev => ({...prev, credits: result.data.updatedCredits}));
        toast.success('Design generated successfully!');
        setOpenOutputDialog(true);
      } else {
        throw new Error(result.data.error || 'Failed to update credits');
      }
    } catch (error) {
      console.error('Error generating room design:', error);
      toast.error(error.message || 'Failed to generate room design');
    } finally {
      setIsLoading(false);
    }
  }

  if (!userDetail) return <LoadingBody />;

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <h1 className='font-bold text-3xl text-slate-700 text-center'>
        Experience AI Remodelling at its Finest
      </h1>
      <p className='text-center text-gray-500'>
        Transform any room with a click of a button, select an area, choose a style and watch as Interior Designer A.I. instantly remodels your environment.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10'>
        <ImageSelection selectedImage={(value)=>onHandleFileSelected(value, 'image')}/>
        <div>
          <RoomType selectedRoomType={(value)=>onHandleFileSelected(value, 'roomType')}/>
          <DesignType selectedDesignType={(value)=>onHandleFileSelected(value, 'designType')}/>
          <Additional selectedAdditional={(value)=>onHandleFileSelected(value, 'additional')}/>
          <Button 
            className='mt-5 w-full' 
            onClick={GenerateAiImage}
            disabled={isLoading || !formData.image || !formData.roomType || 
                     !formData.designType || userDetail.credits === 0}
          >
            {userDetail.credits === 0 
              ? 'Purchase Credits to Generate Designs' 
              : 'Create Room Design'
            }
          </Button>
          <p className='text-sm text-gray-500 mb-52'>
            Note: 1 Credit will be used to redesign your room. You currently have {userDetail.credits} credits.
          </p>
        </div>
      </div>
      <AIOutputDialog 
        openDialog={openOutputDialog}  
        closeDialog={()=>setOpenOutputDialog(false)} 
        originalImage={originalImage} 
        aiImage={aiOutputImage}
      />
    </div>
  )
}

export default CreateNewRoomDesign