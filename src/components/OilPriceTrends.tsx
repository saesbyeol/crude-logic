"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TrendItem {
  period: string;
  change: number;
  changePercentage: number;
}

const OilPriceTrends = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  
  useEffect(() => {
    // Mock data for trends
    const mockTrends: TrendItem[] = [
      { period: '1 Day', change: 0.75, changePercentage: 0.92 },
      { period: '1 Week', change: -1.25, changePercentage: -1.53 },
      { period: '1 Month', change: 2.45, changePercentage: 3.05 },
      { period: '3 Months', change: -3.80, changePercentage: -4.62 },
      { period: '6 Months', change: 5.20, changePercentage: 6.48 },
      { period: '1 Year', change: -8.35, changePercentage: -9.75 },
    ];
    
    setTrends(mockTrends);
  }, []);
  
  return (
    <motion.div
      className="glass-effect rounded-xl p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">Historical Price Trends</h2>
        <div className="flex flex-wrap gap-2">
          {trends.map((trend) => (
            <motion.button
              key={trend.period}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTrend?.period === trend.period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTrend(selectedTrend?.period === trend.period ? null : trend)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {trend.period}
            </motion.button>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {selectedTrend && (
          <motion.div 
            className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTrend.period} Change</h3>
                <p className="text-gray-600 dark:text-gray-300">Price change over the last {selectedTrend.period.toLowerCase()}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <span className={`text-2xl font-bold ${selectedTrend.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {selectedTrend.change >= 0 ? '+' : ''}{selectedTrend.change.toFixed(2)} ({selectedTrend.changePercentage >= 0 ? '+' : ''}{selectedTrend.changePercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % Change
              </th>
              <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900/30 divide-y divide-gray-200 dark:divide-gray-700">
            {trends.map((trend, index) => (
              <motion.tr 
                key={trend.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                className="cursor-pointer"
                onClick={() => setSelectedTrend(selectedTrend?.period === trend.period ? null : trend)}
              >
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {trend.period}
                </td>
                <td className={`px-4 md:px-6 py-4 whitespace-nowrap text-sm ${trend.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(2)}
                </td>
                <td className={`px-4 md:px-6 py-4 whitespace-nowrap text-sm ${trend.changePercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend.changePercentage >= 0 ? '+' : ''}{trend.changePercentage.toFixed(2)}%
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="w-16 md:w-24 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${trend.changePercentage >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(trend.changePercentage) * 2, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
        <p>* Click on any row or period button to see more details</p>
      </div>
    </motion.div>
  );
};

export default OilPriceTrends; 