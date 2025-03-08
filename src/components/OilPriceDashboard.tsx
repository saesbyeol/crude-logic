"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OilPriceChart from './OilPriceChart';
import OilPriceStats from './OilPriceStats';
import OilPriceTrends from './OilPriceTrends';
import OilPriceForecast from './OilPriceForecast';

const OilPriceDashboard = () => {
  const [currentPrice, setCurrentPrice] = useState(67.07);
  const [previousPrice, setPreviousPrice] = useState(66.24);
  const [highPrice, setHighPrice] = useState(68.19);
  const [lowPrice, setLowPrice] = useState(66.10);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Calculate price change
  const priceChange = 0.83; // Fixed value to match the image
  const priceChangePercentage = 1.25; // Fixed value to match the image
  
  // Simulate real-time price updates
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        // Random small price fluctuation
        const fluctuation = (Math.random() - 0.5) * 0.05;
        const newPrice = currentPrice + fluctuation;
        setCurrentPrice(parseFloat(newPrice.toFixed(2)));
        
        // Update high and low if needed
        if (newPrice > highPrice) {
          setHighPrice(parseFloat(newPrice.toFixed(2)));
        }
        if (newPrice < lowPrice) {
          setLowPrice(parseFloat(newPrice.toFixed(2)));
        }
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentPrice, highPrice, lowPrice, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold">Loading Oil Price Data...</h2>
          <p className="mt-2 text-gray-400">Fetching the latest market information</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Initial empty space for the calendar icon */}
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Title and timeframe buttons */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Crude Oil Futures · {timeframe} · MARKETSCOM</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold mr-2">${currentPrice.toFixed(2)}</span>
              <span className="price-up text-lg">+{priceChange.toFixed(2)} (+{priceChangePercentage.toFixed(2)}%)</span>
            </div>
            <div className="flex">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  className={`time-button ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Buy/Sell prices */}
        <div className="flex items-center mb-4">
          <div className="price-tag sell mr-4">
            67.07
            <span className="ml-2 text-xs">SELL</span>
          </div>
          <div className="price-tag buy">
            67.12
            <span className="ml-2 text-xs">BUY</span>
          </div>
          <div className="ml-auto text-sm text-gray-400">
            Vol: <span className="text-white">1,245</span>
          </div>
        </div>
        
        {/* Chart timeframe buttons */}
        <div className="chart-controls mb-4">
          <button className="chart-type-button">1H</button>
          <button className="chart-type-button">4H</button>
          <button className="chart-type-button active">1D</button>
          <span className="ml-4"></span>
          <button className="chart-type-button active">N</button>
          <button className="chart-type-button">Candle</button>
          <button className="chart-type-button active">Vol</button>
        </div>
        
        {/* Main chart */}
        <div className="chart-container mb-8">
          <OilPriceChart />
        </div>
        
        {/* Additional data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="chart-container">
            <h2 className="text-lg font-bold mb-4">Price Statistics</h2>
            <OilPriceStats 
              currentPrice={currentPrice}
              change={priceChange}
              changePercentage={priceChangePercentage}
              high={highPrice}
              low={lowPrice}
            />
          </div>
          <div className="chart-container">
            <h2 className="text-lg font-bold mb-4">Price Forecast</h2>
            <OilPriceForecast />
          </div>
        </div>
        
        {/* Trends */}
        <div className="chart-container mb-8">
          <h2 className="text-lg font-bold mb-4">Historical Trends</h2>
          <OilPriceTrends />
        </div>
      </div>
      
      <footer className="navbar mt-8 py-4">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Oil Price Dashboard | Market data delayed by at least 15 minutes
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Last update: {new Date().toLocaleTimeString()}</span>
          <div className="flex items-center bg-blue-900/30 rounded-full px-2 py-0.5">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
            <span className="text-xs text-blue-300">Live</span>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default OilPriceDashboard; 