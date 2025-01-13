'use client'
import React, { useEffect } from 'react'
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
import { useUser } from '@clerk/nextjs';
import useUserStore from '@/store/useUserStore';

const CreateNewRoomDesign = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  // Zustand store for application state
  const userDetail = useUserStore((state) => state.userDetail);
  const updateCredits = useUserStore((state) => state.updateCredits);
  const verifyUser = useUserStore((state) => state.verifyUser);
  const hasEnoughCredits = useUserStore((state) => state.hasEnoughCredits);
  
  // Local state
  const [formData, setFormData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [aiOutputImage, setAiOutputImage] = React.useState(null);
  const [originalImage, setOriginalImage] = React.useState();
  const [openOutputDialog, setOpenOutputDialog] = React.useState(false);

  // Effect to verify user and check credits
  useEffect(() => {
    const initializeUser = async () => {
      if (isLoaded && user && !userDetail) {
        try {
          await verifyUser(user);
        } catch (error) {
          console.error('Error initializing user:', error);
          toast.error('Failed to load user details. Please try refreshing the page.');
        }
      }
    };

    initializeUser();
  }, [isLoaded, user, userDetail, verifyUser]);

  // Effect to handle zero credits
  useEffect(() => {
    if (userDetail && userDetail.credits === 0) {
      toast.error('You need credits to generate designs. Please purchase credits to continue.');
      router.replace('/dashboard/buy-credits');
    }
  }, [userDetail, router]);

  // Show loading state during initial load
  if (!isLoaded || (isLoaded && user && !userDetail)) {
    return <LoadingBody />;
  }

  // Redirect if no user is authenticated
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  const onHandleFileSelected = (value, fileType) => {
    setFormData(prev => ({...prev, [fileType]: value}));
  }

  const checkCredits = async () => {
    if (!userDetail?.id) {
      toast.error('User details not found. Please try refreshing the page.');
      return false;
    }

    if (!hasEnoughCredits()) {
      toast.error('You need credits to generate designs. Please purchase credits to continue.');
      router.replace('/dashboard/buy-credits');
      return false;
    }

    return true;
  };

  // In your CreateNewRoomDesign component

const GenerateAiImage = async () => {
  if (!formData.image || !formData.roomType || !formData.designType) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    const hasCredits = await checkCredits();
    if (!hasCredits) return;

    setIsLoading(true);
    
    const { imageUrl, error } = await uploadImage({
      file: formData.image,
      bucket: "room_images",
    });

    if (error) {
      throw new Error('Failed to upload image');
    }

    setOriginalImage(imageUrl);

    // Start generation request
    const result = await axios.post('/api/redesign-room', {
      imageUrl: imageUrl,
      roomType: formData.roomType,
      designType: formData.designType,
      additional: formData.additional,
      userEmail: user.emailAddresses[0].emailAddress
    });

    // Check if the request is still processing
    if (result.status === 202) {
      toast.loading('Generating your design. This might take a few minutes...');
      
      // Start polling for the result
      let attempts = 0;
      const maxAttempts = 10;
      
      const pollResult = async () => {
        try {
          const pollResponse = await axios.get(`/api/check-generation-status?id=${result.data.requestId}`);
          
          if (pollResponse.data.status === 'COMPLETED') {
            setAiOutputImage(pollResponse.data.result);
            updateCredits(pollResponse.data.updatedCredits);
            toast.success('Design generated successfully!');
            setOpenOutputDialog(true);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollResult, 30000); // Poll every 30 seconds
          } else {
            throw new Error('Generation timed out after multiple attempts');
          }
        } catch (error) {
          console.error('Error polling for result:', error);
          toast.error('Failed to generate design. Please try again.');
        }
      };

      await pollResult();
    } else {
      // Handle immediate success case
      setAiOutputImage(result.data.result);
      updateCredits(result.data.updatedCredits);
      toast.success('Design generated successfully!');
      setOpenOutputDialog(true);
    }

  } catch (error) {
    console.error('Error generating room design:', error);
    toast.error(error.response?.data?.message || 'Failed to generate room design');
  } finally {
    setIsLoading(false);
  }
};

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
                     !formData.designType || !hasEnoughCredits()}
          >
            {!hasEnoughCredits() 
              ? 'Purchase Credits to Generate Designs' 
              : 'Create Room Design'
            }
          </Button>
          <p className='text-sm text-gray-500 mb-52'>
            Note: 1 Credit will be used to redesign your room. You currently have {userDetail?.credits || 0} credits.
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