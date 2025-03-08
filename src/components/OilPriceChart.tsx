"use client";

import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OilPrice {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

const OilPriceChart = () => {
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '4h' | '1d'>('1d');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [showVolume, setShowVolume] = useState(true);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchOilPrices = async () => {
      try {
        setIsLoading(true);
        
        // Generate different amounts of data based on timeRange
        const pointsToGenerate = timeRange === '1h' ? 60 : timeRange === '4h' ? 240 : 90;
        
        // Mock data - last X days of oil prices
        const mockData: OilPrice[] = Array.from({ length: pointsToGenerate }, (_, i) => {
          const date = new Date();
          
          if (timeRange === '1h') {
            date.setMinutes(date.getMinutes() - (pointsToGenerate - 1 - i));
          } else if (timeRange === '4h') {
            date.setMinutes(date.getMinutes() - (pointsToGenerate - 1 - i) * 4);
          } else {
            date.setDate(date.getDate() - (pointsToGenerate - 1 - i));
          }
          
          // Base price around $67
          let basePrice = 67;
          
          // Add some trend
          const trend = 0.01;
          basePrice += i * trend;
          
          // Add some volatility
          const volatility = 0.5;
          const randomWalk = (Math.random() - 0.5) * volatility;
          
          const price = parseFloat((basePrice + randomWalk).toFixed(2));
          const open = parseFloat((price - (Math.random() - 0.5) * 0.3).toFixed(2));
          const high = parseFloat((Math.max(price, open) + Math.random() * 0.2).toFixed(2));
          const low = parseFloat((Math.min(price, open) - Math.random() * 0.2).toFixed(2));
          const volume = Math.floor(Math.random() * 1000) + 500;
          
          return {
            date: timeRange === '1d' 
              ? date.toISOString().split('T')[0] 
              : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price,
            open,
            high,
            low,
            volume
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
  }, [timeRange]);

  // Calculate moving averages
  const calculateMA = (data: number[], period: number) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      result.push(parseFloat((sum / period).toFixed(2)));
    }
    return result;
  };

  const prices = oilPrices.map(item => item.price);
  const ma20 = calculateMA(prices, 20);
  const ma50 = calculateMA(prices, 50);

  // Create datasets for the chart
  const lineDatasets = [
    {
      label: 'Oil Price (USD)',
      data: oilPrices.map(item => item.price),
      borderColor: 'rgba(255, 255, 255, 0.8)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 1.5,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointRadius: 0,
      pointHoverRadius: 3,
      tension: 0.1,
      fill: false,
      order: 1,
    },
    {
      label: 'MA20',
      data: ma20,
      borderColor: 'rgba(255, 145, 0, 0.8)',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.1,
      fill: false,
      order: 2,
    },
    {
      label: 'MA50',
      data: ma50,
      borderColor: 'rgba(255, 0, 128, 0.8)',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.1,
      fill: false,
      order: 3,
    }
  ];

  // Create the chart data object
  const chartData = {
    labels: oilPrices.map(item => item.date),
    datasets: lineDatasets
  };

  // Add volume dataset if needed
  if (showVolume) {
    // We need to use any type here to bypass TypeScript's strict checking
    // since Chart.js allows mixed chart types but TypeScript doesn't know about it
    const volumeDataset: any = {
      label: 'Volume',
      data: oilPrices.map(item => item.volume / 100), // Scale down for better visualization
      backgroundColor: 'rgba(46, 189, 133, 0.3)', // Single color for all bars
      borderColor: 'transparent',
      borderWidth: 0,
      type: 'bar',
      order: 4,
      yAxisID: 'y1',
    };
    
    chartData.datasets.push(volumeDataset);
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 25, 40, 0.9)',
        titleFont: {
          size: 12,
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          size: 12,
          family: 'Inter, sans-serif',
        },
        padding: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            if (datasetLabel === 'Volume') {
              return `Volume: ${(value * 100).toFixed(0)}`;
            }
            return `${datasetLabel}: $${value.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(45, 55, 72, 0.2)',
        },
        ticks: {
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          color: 'rgba(160, 174, 192, 0.8)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(45, 55, 72, 0.2)',
        },
        ticks: {
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          color: 'rgba(160, 174, 192, 0.8)',
          callback: function(value: any) {
            return '$' + value;
          }
        },
      },
      y1: {
        display: showVolume,
        position: 'left' as const,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            family: 'Inter, sans-serif',
          },
          color: 'rgba(160, 174, 192, 0.8)',
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 3,
      },
    },
    animation: {
      duration: 0, // Set to 0 instead of false to fix type error
    },
  };

  // Function to download chart as image
  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `oil-price-chart-${timeRange}.png`;
      link.href = url;
      link.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] md:h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1">
          {(['1h', '4h', '1d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`trading-button text-xs ${
                timeRange === range ? 'active' : ''
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setChartType('line')}
            className={`trading-button text-xs ${
              chartType === 'line' ? 'active' : ''
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('candle')}
            className={`trading-button text-xs ${
              chartType === 'candle' ? 'active' : ''
            }`}
          >
            Candle
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`trading-button text-xs ${
              showVolume ? 'active' : ''
            }`}
          >
            Vol
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-40px)]">
        <Line data={chartData} options={chartOptions} ref={chartRef} />
      </div>
    </div>
  );
};

export default OilPriceChart; 