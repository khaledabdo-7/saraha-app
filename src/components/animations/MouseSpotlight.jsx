import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const MouseSpotlight = () => {
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none -z-5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] transition-opacity duration-300"
      style={{
        left: mouseX,
        top: mouseY,
        width: 320,
        height: 320,
      }}
    >
      <div className="w-full h-full rounded-full opacity-15 dark:opacity-20 bg-gradient-to-r from-[#3F72AF] to-[#DBE2EF] dark:from-[#3282B8] dark:to-[#0F4C75]" />
    </motion.div>
  );
};
