'use client';
import React, { useState } from 'react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import AIOutputDialog from '../create-new/_components/AIOutputDialog';
import 'react-before-after-slider-component/dist/build.css';
import { Button } from '@/components/ui/button';

const RoomCard = ({room}) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleOpen = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowDialog(true);
    };

    const handleClose = () => {
        setShowDialog(false);
    };

    const FIRST_IMAGE = {
        imageUrl: room.orgImage 
    };
    
    const SECOND_IMAGE = {
        imageUrl: room.aiImage
    };

    return (
        <div className='shadow-md rounded-lg hover:shadow-xl cursor-pointer' >
            <ReactBeforeSliderComponent
                firstImage={FIRST_IMAGE}
                secondImage={SECOND_IMAGE}
            />
            <div className='p-4'>
                <h2> 🏘️ Room Type: {room.roomType}</h2>
                <h2> 🏗️ Design Type: {room.designType}</h2>
                <Button className='mt-5' onClick={handleOpen}>View</Button>
            </div>


            
            <AIOutputDialog 
                openDialog={showDialog}
                closeDialog={handleClose}
                originalImage={room.orgImage}
                aiImage={room.aiImage}
            />
        </div>
    );
}

export default RoomCard;