'use client'
import React, {useState} from 'react'

const DesignType = ({selectedDesignType}) => {
    const [selectedDesign, setSelectedDesign] = useState()
    const Designs = [
        {
            name: 'Modern',
            image: '/modern.avif',
            description: 'Modern designs are sleek, contemporary, and sophisticated. They are perfect for creating a chic and stylish space that reflects your personality and style.'
        },
        {
            name: 'Contemporary',
            image: '/contemporary.avif',
            description: 'Contemporary designs are characterized by their simplicity, functionality, and use of natural materials. They are perfect for creating a warm and inviting space that reflects the latest fashion and technology.'
        },
        {
            name: 'Rustic',
            image: '/rustic.avif',
            description: 'Rustic designs are characterized by their simplicity, functionality, and use of natural materials. They are perfect for creating a warm and inviting space that reflects the latest fashion and technology.'
        },
        {
            name: 'Industrial',
            image: '/Industrial.avif',
            description: 'Industrial designs are characterized by their simplicity, functionality, and use of natural materials. They are perfect for creating a warm and inviting space that reflects the latest fashion and technology.'
        },
        {
            name: 'Traditional',
            image: '/Traditional.avif',  
            description: 'Traditional designs are characterized by their simplicity, functionality, and use of natural materials. They are perfect for creating a warm and inviting space that reflects the latest fashion and technology.'
        },
        {
            name: 'Bohemian',
            image: '/Boheiman.avif',  
            description: 'Bohemian designs are characterized by their simplicity, functionality, and use of natural materials. They are perfect for creating a warm and inviting space that reflects the latest fashion and technology.'    
        },
        
    ]
  return (
    <div className='mt-4'>
        <label className='text-slate-600'>Select A Interior Design Type *</label>
        <div className='grid grif-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
        {Designs.map((design, index) => (
                    <div key={index} onClick={()=>{setSelectedDesign(design.name); selectedDesignType(design.name)}}className='hover:scale-105 trannsition-all duration-300 cursor-pointer'>
                        <img src={design.image} alt={design.name} width={100} height={100} className={`h-[70px] object-cover rounded-lg ${design.name==selectedDesign&&'border-2 border-slate-600 p-2'}`} />
                        <h2 className={~design.name.indexOf(selectedDesign)?'text-slate-700 font-bold':'text-slate-500'}>{design.name}</h2>
                    </div>
                ))}
        </div>
    </div>
  )
}

export default DesignType