"use client";

import { useEffect, useState } from 'react';
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
import { motion } from 'framer-motion';
import axios from 'axios';

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

interface OilPrice {
  date: string;
  price: number;
}

const OilPriceChart = () => {
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOilPrices = async () => {
      try {
        setIsLoading(true);
        // For demo purposes, we'll use mock data
        // In a real app, you would fetch from an API like:
        // const response = await axios.get('https://api.example.com/oil-prices');
        
        // Mock data - last 30 days of oil prices
        const mockData: OilPrice[] = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split('T')[0],
            // Random price between 70 and 90
            price: 70 + Math.random() * 20
          };
        });
        
        setOilPrices(mockData);
      } catch (err) {
        setError('Failed to fetch oil prices');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOilPrices();
  }, []);

  const chartData = {
    labels: oilPrices.map(item => item.date),
    datasets: [
      {
        label: 'Oil Price (USD)',
        data: oilPrices.map(item => item.price),
        borderColor: 'rgba(29, 78, 216, 1)',
        backgroundColor: 'rgba(29, 78, 216, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(29, 78, 216, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.4,
        fill: true,
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
        },
      },
      title: {
        display: true,
        text: 'Crude Oil Price Trends',
        font: {
          size: 20,
          family: 'Inter, sans-serif',
          weight: 'bold' as const,
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
        displayColors: false,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 h-[500px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Line data={chartData} options={chartOptions} />
    </motion.div>
  );
};

export default OilPriceChart; 