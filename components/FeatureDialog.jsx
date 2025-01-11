// components/FeatureDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { featureDetails } from '@/lib/constants';

export const FeatureDialog = ({ isOpen, onClose, feature }) => {
  if (!feature) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {featureDetails[feature].title}
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-4">
            {featureDetails[feature].description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ul className="space-y-3">
            {featureDetails[feature].points.map((point, index) => (
              <li key={index} className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};