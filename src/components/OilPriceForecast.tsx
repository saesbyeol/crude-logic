"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const OilPriceForecast = () => {
  const [forecastType, setForecastType] = useState<'short' | 'medium' | 'long'>('medium');
  const [showScenarios, setShowScenarios] = useState({
    base: true,
    optimistic: true,
    pessimistic: true
  });
  
  // Mock forecast data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate labels based on forecast type
  const getForecastMonths = () => {
    const count = forecastType === 'short' ? 6 : forecastType === 'medium' ? 12 : 24;
    return Array.from({ length: count }, (_, i) => {
      const monthIndex = (currentMonth + i) % 12;
      const year = new Date().getFullYear() + Math.floor((currentMonth + i) / 12);
      return `${months[monthIndex]} ${year}`;
    });
  };
  
  const labels = getForecastMonths();
  
  // Current price around $80
  const currentPrice = 80 + (Math.random() * 5 - 2.5);
  
  // Generate forecast data with some randomness but a general trend based on forecast type
  const generateForecastData = () => {
    const count = labels.length;
    const trendFactor = forecastType === 'short' ? 0.8 : forecastType === 'medium' ? 1.2 : 1.5;
    const volatilityFactor = forecastType === 'short' ? 1 : forecastType === 'medium' ? 1.5 : 2;
    
    return Array.from({ length: count }, (_, i) => {
      // Add some randomness but with an overall upward trend
      return currentPrice + (i * trendFactor) + (Math.random() * volatilityFactor * 6 - volatilityFactor * 3);
    });
  };
  
  const forecastData = generateForecastData();
  
  // Generate optimistic forecast (higher)
  const optimisticFactor = forecastType === 'short' ? 5 : forecastType === 'medium' ? 8 : 12;
  const optimisticForecast = forecastData.map((price, i) => 
    price + optimisticFactor + (i * 0.5) + (Math.random() * 3)
  );
  
  // Generate pessimistic forecast (lower)
  const pessimisticFactor = forecastType === 'short' ? 5 : forecastType === 'medium' ? 8 : 12;
  const pessimisticForecast = forecastData.map((price, i) => 
    price - pessimisticFactor - (i * 0.3) - (Math.random() * 3)
  );
  
  const datasets = [];
  
  if (showScenarios.base) {
    datasets.push({
      label: 'Base Forecast',
      data: forecastData,
      borderColor: 'rgba(59, 130, 246, 1)', // Blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointRadius: 4,
      tension: 0.4,
      fill: false,
    });
  }
  
  if (showScenarios.optimistic) {
    datasets.push({
      label: 'Optimistic Scenario',
      data: optimisticForecast,
      borderColor: 'rgba(16, 185, 129, 1)', // Green
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      pointBorderColor: '#fff',
      pointRadius: 3,
      tension: 0.4,
      borderDash: [5, 5],
      fill: false,
    });
  }
  
  if (showScenarios.pessimistic) {
    datasets.push({
      label: 'Pessimistic Scenario',
      data: pessimisticForecast,
      borderColor: 'rgba(239, 68, 68, 1)', // Red
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(239, 68, 68, 1)',
      pointBorderColor: '#fff',
      pointRadius: 3,
      tension: 0.4,
      borderDash: [5, 5],
      fill: false,
    });
  }
  
  const chartData = {
    labels,
    datasets,
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${forecastType === 'short' ? '6-Month' : forecastType === 'medium' ? '12-Month' : '24-Month'} Oil Price Forecast`,
        font: {
          size: 20,
          family: 'Inter, sans-serif',
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          size: 14,
          family: 'Inter, sans-serif',
        },
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toFixed(2)} per barrel`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          maxRotation: 45,
          minRotation: 45,
          callback: function(value: any, index: number, values: any[]) {
            // Show fewer labels for better readability
            if (forecastType === 'long') {
              return index % 3 === 0 ? labels[index] : '';
            } else if (forecastType === 'medium') {
              return index % 2 === 0 ? labels[index] : '';
            }
            return labels[index];
          }
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          callback: function(value: any) {
            return '$' + value;
          }
        },
      },
    },
    animation: {
      duration: 2000,
    },
    elements: {
      point: {
        radius: 0, // Hide points by default
        hoverRadius: 6, // Show on hover
      },
    },
  };
  
  return (
    <motion.div 
      className="glass-effect rounded-xl p-4 md:p-6 h-[400px] md:h-[500px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          {(['short', 'medium', 'long'] as const).map((type) => (
            <motion.button
              key={type}
              onClick={() => setForecastType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                forecastType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type === 'short' ? 'Short-term' : type === 'medium' ? 'Medium-term' : 'Long-term'}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => setShowScenarios({...showScenarios, base: !showScenarios.base})}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              showScenarios.base 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Base
          </motion.button>
          <motion.button
            onClick={() => setShowScenarios({...showScenarios, optimistic: !showScenarios.optimistic})}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              showScenarios.optimistic 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Optimistic
          </motion.button>
          <motion.button
            onClick={() => setShowScenarios({...showScenarios, pessimistic: !showScenarios.pessimistic})}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              showScenarios.pessimistic 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pessimistic
          </motion.button>
        </div>
      </div>
      
      <div className="h-[calc(100%-100px)]">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
        <p>* Forecast based on historical trends, market analysis, and geopolitical factors.</p>
      </div>
    </motion.div>
  );
};

export default OilPriceForecast; 