"use client";

import { motion } from 'framer-motion';

interface OilPriceStatsProps {
  currentPrice: number;
  change: number;
  changePercentage: number;
  high: number;
  low: number;
}

const OilPriceStats = ({ 
  currentPrice, 
  change, 
  changePercentage, 
  high, 
  low 
}: OilPriceStatsProps) => {
  const isPositiveChange = change >= 0;
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {/* Current Price */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-gray-500 text-sm font-medium mb-2">Current Price</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
          <span className="ml-2 text-sm font-medium mb-1">per barrel</span>
        </div>
        <div className={`mt-2 flex items-center ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
          <span className="text-lg font-semibold">
            {isPositiveChange ? '+' : ''}{change.toFixed(2)} ({changePercentage.toFixed(2)}%)
          </span>
          <svg 
            className="w-5 h-5 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isPositiveChange ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
            />
          </svg>
        </div>
      </motion.div>
      
      {/* Daily High */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-gray-500 text-sm font-medium mb-2">Daily High</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-gray-900">${high.toFixed(2)}</span>
          <span className="ml-2 text-sm font-medium mb-1">per barrel</span>
        </div>
        <div className="mt-2 text-blue-600">
          <span className="text-lg font-semibold">
            {((high - currentPrice) / currentPrice * 100).toFixed(2)}% from current
          </span>
        </div>
      </motion.div>
      
      {/* Daily Low */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-gray-500 text-sm font-medium mb-2">Daily Low</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-gray-900">${low.toFixed(2)}</span>
          <span className="ml-2 text-sm font-medium mb-1">per barrel</span>
        </div>
        <div className="mt-2 text-blue-600">
          <span className="text-lg font-semibold">
            {((currentPrice - low) / low * 100).toFixed(2)}% from current
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OilPriceStats; 