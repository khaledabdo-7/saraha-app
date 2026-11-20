import React from 'react';
import { motion } from 'framer-motion';

export const InteractiveBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Light mode animated orbs */}
      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-10 w-[420px] h-[420px] rounded-full blur-[110px] opacity-35 bg-[#3F72AF] dark:hidden"
      />
      <motion.div
        animate={{
          x: [0, -90, 70, 0],
          y: [0, 80, -60, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 left-10 w-[480px] h-[480px] rounded-full blur-[120px] opacity-30 bg-[#DBE2EF] dark:hidden"
      />

      {/* Dark mode animated orbs */}
      <motion.div
        animate={{
          x: [0, 70, -50, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden dark:block absolute top-10 right-20 w-[450px] h-[450px] rounded-full blur-[130px] opacity-25 bg-[#3282B8]"
      />
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 90, -50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden dark:block absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 bg-[#0F4C75]"
      />

      {/* Subtle Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
