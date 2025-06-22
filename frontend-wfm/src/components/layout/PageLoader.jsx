import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen w-full bg-slate-900">
    <motion.div
      className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-[#39ff14] rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export default PageLoader;