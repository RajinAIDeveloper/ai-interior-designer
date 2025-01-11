// components/BeforeAfter.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const beforeAfterExamples = [
  {
    id: 1,
    before: "https://idovwputkmimglkmxedh.supabase.co/storage/v1/object/public/room_images/43991b55-1c1c-41da-b7d3-866f52f824b6.jpg",
    after: "https://idovwputkmimglkmxedh.supabase.co/storage/v1/object/public/room_images/b9e3a7f5-9ea1-4b47-8084-c0630d02c832.png",
    title: "Empty to Office Transformation",
  },
  {
    id: 2,
    before: "https://idovwputkmimglkmxedh.supabase.co/storage/v1/object/public/room_images/5b225f71-6d6d-4d10-b079-5630382ec48e.jpg",
    after: "https://idovwputkmimglkmxedh.supabase.co/storage/v1/object/public/room_images/a6886809-81ed-4fa7-84aa-5b4ed42029a6.png",
    title: "Empty Space to Game Living Room Transformation",
  },
  // Add more examples as needed
];

export const BeforeAfter = () => {
  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Transform Any Space
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            See the magic happen before your eyes. Our AI transforms ordinary rooms into extraordinary spaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {beforeAfterExamples.map((example) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10 z-10" />
                
                {/* Before Image */}
                <div className="absolute inset-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0">
                  <img
                    src={example.before}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                    Before
                  </div>
                </div>

                {/* After Image */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
                  <img
                    src={example.after}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                    After
                  </div>
                </div>

                {/* Hover Instruction */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-100 group-hover:opacity-0 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
                    <span className="font-medium">Hover to see transformation</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-medium text-slate-800">{example.title}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};