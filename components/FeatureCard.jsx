import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

// Create a motion button component
const MotionButton = motion(Button);

export const FeatureCard = ({ icon: Icon, title, description, onLearnMore }) => (
  <motion.div 
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="bg-gradient-to-br from-slate-600 to-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="font-semibold text-xl mb-3">{title}</h3>
    <p className="text-slate-600 mb-4">{description}</p>
    <MotionButton 
      variant="ghost" 
      className="text-slate-800 hover:text-slate-600"
      onClick={onLearnMore}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Learn more <ArrowRight className="ml-2 w-4 h-4" />
    </MotionButton>
  </motion.div>
);