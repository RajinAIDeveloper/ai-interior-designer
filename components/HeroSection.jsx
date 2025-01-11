// components/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const HeroSection = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
    <motion.div 
      className="text-center space-y-8 py-16"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <motion.h1 
        className="text-5xl md:text-7xl font-bold tracking-tight"
        variants={fadeInUp}
      >
        <span className="text-slate-800">Smart AI Driven</span>
        <br />
        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Interior Design
        </span>
      </motion.h1>
      
      <motion.p 
        className="text-slate-600 text-xl max-w-3xl mx-auto"
        variants={fadeInUp}
      >
        Transform Your Space with AI: Effortless Room & Home Interior Design at Your Fingertips!
      </motion.p>
      
      <motion.div variants={fadeInUp}>
        <Link href={`/sign-in`}>
        <Button 
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-6 text-lg rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
        </Link>
        
      </motion.div>
    </motion.div>

    <motion.div 
      className="flex justify-center mt-12"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <ChevronDown className="w-8 h-8 text-slate-400" />
    </motion.div>
  </div>
);