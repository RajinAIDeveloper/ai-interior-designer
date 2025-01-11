// app/page.jsx
'use client'
import React, { useState } from 'react';
import { Upload, Palette, Download, HeadphonesIcon } from 'lucide-react';
import Header from './dashboard/_components/Header';
import { FeatureCard } from '../components/FeatureCard';
import { FeatureDialog } from '../components/FeatureDialog';
import { HeroSection } from '../components/HeroSection';
import { motion } from 'framer-motion';
import { BeforeAfter } from '@/components/BeforeAfter';

const LandingPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <HeroSection />

      <BeforeAfter />

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-32 mb-20">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-slate-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Upload}
              title="Upload"
              description="Simply upload a photo of your room to get started"
              onLearnMore={() => setSelectedFeature('upload')}
            />
            <FeatureCard 
              icon={Palette}
              title="Select Design"
              description="Choose from various design styles and preferences"
              onLearnMore={() => setSelectedFeature('design')}
            />
            <FeatureCard 
              icon={Download}
              title="Get Results"
              description="Receive your AI-generated interior design instantly"
              onLearnMore={() => setSelectedFeature('download')}
            />
            <FeatureCard 
              icon={HeadphonesIcon}
              title="24/7 Support"
              description="Our team is here to help you around the clock"
              onLearnMore={() => setSelectedFeature('support')}
            />
          </div>
        </div>
      </div>

      <FeatureDialog 
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
      />
    </div>
  );
};

export default LandingPage;