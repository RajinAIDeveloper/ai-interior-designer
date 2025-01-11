'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateImage } from './upload-utils'

const ImageSelection = ({ selectedImage }) => {
    const [file, setFile] = useState()
    const [error, setError] = useState('')
    
    const onFileSelected = async (event) => {
        const file = event.target.files[0]
        
        if (!file) return
        
        try {
            await validateImage(file)
            setError('')
            setFile(file)
            selectedImage(file)
        } catch (error) {
            setError(error.message)
            setFile(null)
            selectedImage(null)
            event.target.value = '' // Reset input
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Select An Image to Remodel
            </label>
            <div className="mt-3">
                <label htmlFor="upload-image">
                    <div className={`p-28 border rounded-xl border-dotted flex justify-center items-center border-blue-700 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all ${
                        file ? 'p-0 bg-white' : ''
                    }`}>
                        {!file ? (
                            <Image
                                src="/upload-image.svg"
                                alt="upload-image"
                                width={70}
                                height={70}
                                className="opacity-50"
                            />
                        ) : (
                            <Image
                                className="w-full h-[300px] object-cover rounded-xl"
                                src={URL.createObjectURL(file)}
                                alt="upload-image"
                                width={300}
                                height={300}
                            />
                        )}
                    </div>
                </label>
                <input
                    onChange={onFileSelected}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    id="upload-image"
                    className="hidden"
                />
                {error && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}

export default ImageSelection