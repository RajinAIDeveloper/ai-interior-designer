import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

const RoomType = ({selectedRoomType}) => {
    const selectRoomType = (value) => {
      selectedRoomType(value)
    }
  return (
    <div>
        <label className='text-slate-600'>Select A Room Type *</label>
        <Select onValueChange={(value)=>selectRoomType(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Living Room">Living Room</SelectItem>
                <SelectItem value="Bed Room">Bed Room</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Bathroom">Bathroom</SelectItem>
            </SelectContent>
        </Select>
    </div>
  )
}

export default RoomType