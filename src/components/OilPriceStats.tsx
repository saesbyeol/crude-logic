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
  
  // Calculate the percentage of current price between high and low
  const priceRange = high - low;
  const currentPercentage = ((currentPrice - low) / priceRange) * 100;
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {/* Current Price */}
      <motion.div 
        className="glass-effect rounded-xl p-4 md:p-6 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 }
        }}
      >
        <motion.div 
          className={`absolute bottom-0 left-0 h-1 ${isPositiveChange ? 'bg-green-500' : 'bg-red-500'}`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1 }}
        />
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Current Price</h3>
        <div className="flex items-end">
          <motion.span 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            ${currentPrice.toFixed(2)}
          </motion.span>
          <span className="ml-2 text-xs md:text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">per barrel</span>
        </div>
        <div className={`mt-2 flex items-center ${isPositiveChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <span className="text-base md:text-lg font-semibold">
            {isPositiveChange ? '+' : ''}{change.toFixed(2)} ({changePercentage.toFixed(2)}%)
          </span>
          <motion.svg 
            className="w-4 h-4 md:w-5 md:h-5 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              y: [0, -4, 0],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isPositiveChange ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
            />
          </motion.svg>
        </div>
      </motion.div>
      
      {/* Daily High */}
      <motion.div 
        className="glass-effect rounded-xl p-4 md:p-6 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ 
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 }
        }}
      >
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.1 }}
        />
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Daily High</h3>
        <div className="flex items-end">
          <motion.span 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.1
            }}
          >
            ${high.toFixed(2)}
          </motion.span>
          <span className="ml-2 text-xs md:text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">per barrel</span>
        </div>
        <div className="mt-2 text-blue-600 dark:text-blue-400">
          <span className="text-base md:text-lg font-semibold">
            {((high - currentPrice) / currentPrice * 100).toFixed(2)}% from current
          </span>
        </div>
      </motion.div>
      
      {/* Daily Low */}
      <motion.div 
        className="glass-effect rounded-xl p-4 md:p-6 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ 
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 }
        }}
      >
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Daily Low</h3>
        <div className="flex items-end">
          <motion.span 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2
            }}
          >
            ${low.toFixed(2)}
          </motion.span>
          <span className="ml-2 text-xs md:text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">per barrel</span>
        </div>
        <div className="mt-2 text-purple-600 dark:text-purple-400">
          <span className="text-base md:text-lg font-semibold">
            {((currentPrice - low) / low * 100).toFixed(2)}% from current
          </span>
        </div>
      </motion.div>
      
      {/* Price Range Indicator */}
      <motion.div 
        className="glass-effect rounded-xl p-4 md:p-6 md:col-span-3 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Today's Price Range</h3>
        <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${currentPercentage}%` }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <div className="absolute left-0 top-0 h-full w-full flex justify-between items-center px-3">
            <span className="text-xs font-medium text-white z-10">${low.toFixed(2)}</span>
            <motion.div 
              className="absolute h-full w-1 bg-white"
              style={{ left: `${currentPercentage}%` }}
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.5, delay: 1 }}
            />
            <span className="text-xs font-medium text-white z-10">${high.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-2 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          Current price is at {currentPercentage.toFixed(0)}% of today's range
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OilPriceStats; 