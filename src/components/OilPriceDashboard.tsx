"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OilPriceChart from './OilPriceChart';
import OilPriceStats from './OilPriceStats';
import OilPriceTrends from './OilPriceTrends';
import OilPriceForecast from './OilPriceForecast';

const OilPriceDashboard = () => {
  const [currentPrice, setCurrentPrice] = useState(81.25);
  const [previousPrice, setPreviousPrice] = useState(80.50);
  const [highPrice, setHighPrice] = useState(82.75);
  const [lowPrice, setLowPrice] = useState(80.10);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate price change
  const priceChange = currentPrice - previousPrice;
  const priceChangePercentage = (priceChange / previousPrice) * 100;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Oil Price Data...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="max-w-7xl mx-auto mb-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-900"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Oil Price Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-500 mt-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Real-time visualization of global crude oil prices and trends
        </motion.p>
      </header>
      
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Stats Section */}
        <section>
          <OilPriceStats 
            currentPrice={currentPrice}
            change={priceChange}
            changePercentage={priceChangePercentage}
            high={highPrice}
            low={lowPrice}
          />
        </section>
        
        {/* Chart Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <motion.h2 
              className="text-xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Recent Price Trends
            </motion.h2>
            <OilPriceChart />
          </div>
          <div>
            <motion.h2 
              className="text-xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Price Forecast
            </motion.h2>
            <OilPriceForecast />
          </div>
        </section>
        
        {/* Trends Section */}
        <section>
          <OilPriceTrends />
        </section>
        
        {/* Additional Information */}
        <section>
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Dashboard</h2>
            <p className="text-gray-600 mb-4">
              This dashboard provides a comprehensive view of global crude oil prices, including historical trends, 
              current prices, and future forecasts. The data is updated in real-time to provide the most accurate 
              information for decision-making and analysis.
            </p>
            <p className="text-gray-600">
              The visualizations are designed to be intuitive and informative, allowing users to quickly understand 
              the current state of the oil market and identify potential trends. The forecast models are based on 
              historical data, market analysis, and geopolitical factors.
            </p>
          </motion.div>
        </section>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Oil Price Dashboard | Data updated in real-time
        </p>
      </footer>
    </motion.div>
  );
};

export default OilPriceDashboard; 