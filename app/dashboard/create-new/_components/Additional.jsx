import React from 'react'
import { Textarea } from '@/components/ui/textarea'
const Additional = ({selectedAdditional}) => {
  return (
    <div className='mt-5'>
        <label className='text-slate-600'>Additional Requirements (Optional)</label>
        <Textarea className='mt-2' onChange={(e)=>selectedAdditional(e.target.value)} placeholder="Add all your additional requirements here." />
    </div>
  )
}

export default Additional