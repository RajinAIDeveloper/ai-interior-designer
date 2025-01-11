'use client'
import React, { useContext, useEffect } from 'react'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
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

const CreateNewRoomDesign = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [aiOutputImage, setAiOutputImage] = React.useState(null);
  const [originalImage, setoriginalImage] = React.useState();
  const [openOutputDialog, setOpenOutputDialog] = React.useState(false);

  // Effect to handle user detail initialization
  useEffect(() => {
    const initializeUserDetail = async () => {
      if (isLoaded && user && !userDetail) {
        try {
          // Fetch user details from your backend
          const response = await axios.get(`/api/user-details?email=${user.emailAddresses[0].emailAddress}`);
          if (response.data) {
            setUserDetail(response.data);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast.error('Failed to load user details. Please try refreshing the page.');
        }
      }
    };

    initializeUserDetail();
  }, [isLoaded, user, userDetail, setUserDetail]);

  // Show loading state only during initial load
  if (!isLoaded || (isLoaded && user && !userDetail)) {
    return <LoadingBody />;
  }

  // Redirect if no user is authenticated
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  const onHandleFileSelected = (value, fileType) => {
    setFormData(prev => ({...prev, [fileType]:value}));
  }

  const checkCredits = async () => {
    try {
      if (!userDetail?.id) {
        toast.error('User details not found. Please try refreshing the page.');
        return false;
      }

      const response = await axios.post('/api/check-credits', {
        userId: userDetail.id
      });

      if (response.data.success && response.data.hasEnoughCredits) {
        return true;
      } else {
        toast.error('Insufficient credits. Please purchase credits to continue.');
        router.push('/dashboard/buy-credits');
        return false;
      }
    } catch (error) {
      console.error('Error checking credits:', error);
      toast.error('Failed to verify credits. Please try again.');
      return false;
    }
  };

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

      setoriginalImage(imageUrl);
      
      const result = await axios.post('/api/redesign-room', {
        imageUrl: imageUrl,
        roomType: formData.roomType,
        designType: formData.designType,
        additional: formData.additional,
        userEmail: user.emailAddresses[0].emailAddress
      });
      
      setAiOutputImage(result.data.result);

      const response = await axios.post('/api/deduct-credits', {
        userId: userDetail.id,
        currentCredits: userDetail.credits || 0
      });

      if (response.data.success) {
        setUserDetail(prev => ({
          ...prev,
          credits: response.data.updatedCredits
        }));
        toast.success('Design generated successfully!');
        setOpenOutputDialog(true);
      } else {
        throw new Error(response.data.error || 'Failed to update credits');
      }
    } catch (error) {
      console.error('Error generating room design:', error);
      toast.error(error.message || 'Failed to generate room design');
    } finally {
      setIsLoading(false);
    }
  }

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
            disabled={isLoading || !formData.image || !formData.roomType || !formData.designType}
          >
            Create Room Design
          </Button>
          <p className='text-sm text-gray-500 mb-52'>
            Note: 1 Credit will be used to redesign your room. You can top up your credits at any time.
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