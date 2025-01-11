import React from 'react'
import Image from 'next/image'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'

const EmptyList = () => {
  return (
    <div className='flex items-center justify-center mt-10 flex-col'>
        <Image src='/placeholder.png' alt='placeholder' width={200} height={200}/>
        <h2 className='mt-5 font-medium text-lg text-gray-500'>Create New AI Interior Design for your room</h2>
        <Link href='/dashboard/create-new'>
            <Button className='mt-5 text-white bg-slate-600' variant='primary'>+ Create New Design</Button>
        </Link>
    </div>
  )
}

export default EmptyList