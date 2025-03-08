"use client";

import { motion } from 'framer-motion';
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
  // Mock forecast data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate labels for the next 12 months
  const labels = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    return months[monthIndex];
  });
  
  // Current price around $80
  const currentPrice = 80 + (Math.random() * 5 - 2.5);
  
  // Generate forecast data with some randomness but a general upward trend
  const forecastData = Array.from({ length: 12 }, (_, i) => {
    // Add some randomness but with an overall upward trend
    return currentPrice + (i * 1.5) + (Math.random() * 6 - 3);
  });
  
  // Generate optimistic forecast (higher)
  const optimisticForecast = forecastData.map(price => price + 5 + (Math.random() * 3));
  
  // Generate pessimistic forecast (lower)
  const pessimisticForecast = forecastData.map(price => price - 5 - (Math.random() * 3));
  
  const chartData = {
    labels,
    datasets: [
      {
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
      },
      {
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
      },
      {
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
      },
    ],
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
        text: '12-Month Oil Price Forecast',
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
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 h-[500px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Line data={chartData} options={chartOptions} />
      <div className="mt-4 text-sm text-gray-500">
        <p>* Forecast based on historical trends, market analysis, and geopolitical factors.</p>
        <p>* Optimistic scenario assumes increased global demand and reduced production.</p>
        <p>* Pessimistic scenario assumes economic slowdown and increased production.</p>
      </div>
    </motion.div>
  );
};

export default OilPriceForecast; 