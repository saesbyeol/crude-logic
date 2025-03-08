"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TrendItem {
  period: string;
  change: number;
  changePercentage: number;
}

const OilPriceTrends = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  
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
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Price Trends</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trends.map((trend, index) => (
              <motion.tr 
                key={trend.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {trend.period}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${trend.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.changePercentage >= 0 ? '+' : ''}{trend.changePercentage.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-24 h-6 bg-gray-100 rounded-full overflow-hidden">
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
    </motion.div>
  );
};

export default OilPriceTrends; 