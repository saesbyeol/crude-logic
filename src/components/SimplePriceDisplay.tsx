"use client";

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
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
  ScriptableContext,
  TooltipItem,
  Scale,
  ChartTypeRegistry
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

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

// Time range options
type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

const SimplePriceDisplay = () => {
  // State for settings panel
  const [showSettings, setShowSettings] = React.useState(false);
  const [settings, setSettings] = React.useState({
    theme: 'dark',
    refreshInterval: 60,
    chartAnimation: true,
    showVolatilityIndicator: false
  });
  
  // State for time range selection
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>('1W');
  
  // State for oil price data
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [priceData, setPriceData] = React.useState({
    currentPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    dailyLow: 0,
    dailyHigh: 0,
    weeklyChange: 0,
    monthlyChange: 0,
    yearlyChange: 0
  });
  
  // State for chart data
  const [chartData, setChartData] = React.useState({
    priceChartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Oil Price (USD)',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#2ebd85',
        backgroundColor: 'rgba(46, 189, 133, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#2ebd85',
        pointBorderColor: '#151c2c',
        pointBorderWidth: 2,
      }]
    },
    trendData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Monthly Change (%)',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: function(context: ScriptableContext<'bar'>) {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? '#2ebd85' : '#ff5252';
        },
        borderRadius: 4,
      }]
    },
    forecastData: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Optimistic',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#2ebd85',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#2ebd85',
          pointBorderColor: '#151c2c',
          pointBorderWidth: 2,
        },
        {
          label: 'Base Case',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#3b82f6',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#151c2c',
          pointBorderWidth: 2,
        },
        {
          label: 'Pessimistic',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#ff5252',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#ff5252',
          pointBorderColor: '#151c2c',
          pointBorderWidth: 2,
        }
      ]
    }
  });

  // State for historical price data by time range
  const [historicalPriceData, setHistoricalPriceData] = React.useState<{
    [key in TimeRange]: {
      labels: string[];
      prices: number[];
      change: number;
      changePercent: number;
    }
  }>({
    '1D': { labels: [], prices: [], change: 0, changePercent: 0 },
    '1W': { labels: [], prices: [], change: 0, changePercent: 0 },
    '1M': { labels: [], prices: [], change: 0, changePercent: 0 },
    '3M': { labels: [], prices: [], change: 0, changePercent: 0 },
    '6M': { labels: [], prices: [], change: 0, changePercent: 0 },
    '1Y': { labels: [], prices: [], change: 0, changePercent: 0 },
  });

  // State for news data
  const [newsData, setNewsData] = React.useState<Array<{title: string, date: string, impact: string}>>([]);
  
  // Function to generate time labels based on selected time range
  const generateTimeLabels = (range: TimeRange): string[] => {
    const today = new Date();
    const labels: string[] = [];
    
    switch(range) {
      case '1D':
        // Hourly labels for 1 day
        for (let i = 0; i < 24; i += 2) {
          const hour = i % 12 === 0 ? 12 : i % 12;
          labels.push(`${hour}${i < 12 ? 'am' : 'pm'}`);
        }
        return labels.slice(0, 12); // Return 12 labels (every 2 hours)
        
      case '1W':
        // Daily labels for 1 week
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        return labels;
        
      case '1M':
        // Weekly labels for 1 month
        for (let i = 0; i < 4; i++) {
          const weekStart = new Date(today);
          weekStart.setDate(weekStart.getDate() - (i * 7) - 21);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          labels.push(`${weekStart.getDate()}/${weekStart.getMonth() + 1}`);
        }
        return labels.reverse();
        
      case '3M':
        // Bi-weekly labels for 3 months
        for (let i = 0; i < 6; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - (i * 14) - 70);
          labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
        }
        return labels.reverse();
        
      case '6M':
        // Monthly labels for 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        }
        return labels;
        
      case '1Y':
        // Bi-monthly labels for 1 year
        for (let i = 11; i >= 0; i -= 2) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        }
        return labels;
        
      default:
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  };
  
  // Function to generate random price data based on time range
  const generatePriceData = (range: TimeRange, basePrice: number): number[] => {
    const volatility = {
      '1D': 0.005, // 0.5% volatility for 1 day
      '1W': 0.01,  // 1% volatility for 1 week
      '1M': 0.03,  // 3% volatility for 1 month
      '3M': 0.05,  // 5% volatility for 3 months
      '6M': 0.08,  // 8% volatility for 6 months
      '1Y': 0.15,  // 15% volatility for 1 year
    };
    
    const dataPoints = {
      '1D': 12,
      '1W': 7,
      '1M': 4,
      '3M': 6,
      '6M': 6,
      '1Y': 6,
    };
    
    // Generate random walk with trend
    const trend = Math.random() * 0.02 - 0.01; // Random trend between -1% and +1%
    let price = basePrice;
    const prices: number[] = [];
    
    for (let i = 0; i < dataPoints[range]; i++) {
      // Add random noise based on volatility
      const noise = (Math.random() * 2 - 1) * volatility[range] * basePrice;
      // Add trend component
      const trendComponent = trend * basePrice * (i / dataPoints[range]);
      
      price = price + noise + trendComponent;
      prices.push(parseFloat(price.toFixed(2)));
    }
    
    return prices;
  };
  
  // Function to fetch oil price data
  const fetchOilPriceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch from an actual API
      // For demo purposes, we'll simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random price data
      const basePrice = 67 + (Math.random() * 3 - 1.5);
      const change = Math.random() * 2 - 1;
      const percentChange = (change / basePrice) * 100;
      
      // Update price data
      setPriceData({
        currentPrice: parseFloat(basePrice.toFixed(2)),
        priceChange: parseFloat(change.toFixed(2)),
        priceChangePercent: parseFloat(percentChange.toFixed(2)),
        dailyLow: parseFloat((basePrice - Math.random() * 2).toFixed(2)),
        dailyHigh: parseFloat((basePrice + Math.random() * 2).toFixed(2)),
        weeklyChange: parseFloat((Math.random() * 5 - 1).toFixed(2)),
        monthlyChange: parseFloat((Math.random() * 4 - 2).toFixed(2)),
        yearlyChange: parseFloat((Math.random() * 20 - 5).toFixed(2))
      });
      
      // Generate historical price data for all time ranges
      const newHistoricalData = {} as typeof historicalPriceData;
      
      // Generate data for each time range
      Object.keys(historicalPriceData).forEach((range) => {
        const timeRange = range as TimeRange;
        const labels = generateTimeLabels(timeRange);
        const prices = generatePriceData(timeRange, basePrice);
        
        // Calculate change and percent change for this time range
        const startPrice = prices[0];
        const endPrice = prices[prices.length - 1];
        const rangeChange = parseFloat((endPrice - startPrice).toFixed(2));
        const rangeChangePercent = parseFloat(((rangeChange / startPrice) * 100).toFixed(2));
        
        newHistoricalData[timeRange] = {
          labels,
          prices,
          change: rangeChange,
          changePercent: rangeChangePercent
        };
      });
      
      setHistoricalPriceData(newHistoricalData);
      
      // Update chart data with the selected time range
      const selectedRangeData = newHistoricalData[selectedTimeRange];
      
      // Generate random chart data
      const weeklyPrices = Array(7).fill(0).map(() => parseFloat((basePrice + (Math.random() * 2 - 1)).toFixed(2)));
      const monthlyChanges = Array(6).fill(0).map(() => parseFloat((Math.random() * 6 - 3).toFixed(2)));
      
      // Generate forecast data
      const baseForecast = basePrice;
      const optimisticForecast = Array(6).fill(0).map((_, i) => 
        parseFloat((baseForecast * (1 + 0.02 * (i + 1) + Math.random() * 0.01)).toFixed(2))
      );
      const baseCaseForecast = Array(6).fill(0).map((_, i) => 
        parseFloat((baseForecast * (1 + 0.01 * (i + 1) - Math.random() * 0.01)).toFixed(2))
      );
      const pessimisticForecast = Array(6).fill(0).map((_, i) => 
        parseFloat((baseForecast * (1 - 0.01 * (i + 1) - Math.random() * 0.01)).toFixed(2))
      );
      
      // Update chart data
      setChartData({
        priceChartData: {
          labels: selectedRangeData.labels,
          datasets: [{
            label: 'Oil Price (USD)',
            data: selectedRangeData.prices,
            borderColor: '#2ebd85',
            backgroundColor: 'rgba(46, 189, 133, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#2ebd85',
            pointBorderColor: '#151c2c',
            pointBorderWidth: 2,
          }]
        },
        trendData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Change (%)',
            data: monthlyChanges,
            backgroundColor: function(context: ScriptableContext<'bar'>) {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? '#2ebd85' : '#ff5252';
            },
            borderRadius: 4,
          }]
        },
        forecastData: {
          labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Optimistic',
              data: optimisticForecast,
              borderColor: '#2ebd85',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#2ebd85',
              pointBorderColor: '#151c2c',
              pointBorderWidth: 2,
            },
            {
              label: 'Base Case',
              data: baseCaseForecast,
              borderColor: '#3b82f6',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#151c2c',
              pointBorderWidth: 2,
            },
            {
              label: 'Pessimistic',
              data: pessimisticForecast,
              borderColor: '#ff5252',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#ff5252',
              pointBorderColor: '#151c2c',
              pointBorderWidth: 2,
            }
          ]
        }
      });
      
      // Generate news data
      setNewsData([
        { 
          title: "OPEC+ considers extending production cuts", 
          date: new Date().toLocaleDateString(), 
          impact: "Bullish" 
        },
        { 
          title: "US crude inventories rise unexpectedly", 
          date: new Date(Date.now() - 86400000).toLocaleDateString(), 
          impact: "Bearish" 
        },
        { 
          title: "Middle East tensions escalate", 
          date: new Date(Date.now() - 172800000).toLocaleDateString(), 
          impact: "Bullish" 
        },
        { 
          title: "Global demand forecast revised higher", 
          date: new Date(Date.now() - 259200000).toLocaleDateString(), 
          impact: "Bullish" 
        }
      ]);
      
    } catch (err) {
      console.error("Error fetching oil price data:", err);
      setError("Failed to fetch oil price data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    
    // Update chart data with the selected time range
    if (historicalPriceData[range].labels.length > 0) {
      setChartData({
        ...chartData,
        priceChartData: {
          ...chartData.priceChartData,
          labels: historicalPriceData[range].labels,
          datasets: [{
            ...chartData.priceChartData.datasets[0],
            data: historicalPriceData[range].prices
          }]
        }
      });
    }
  };
  
  // Function to handle settings change
  const handleSettingsChange = (setting: string, value: any) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  // Fetch data on component mount
  React.useEffect(() => {
    fetchOilPriceData();
    
    // Set up interval to refresh data based on settings
    const intervalId = setInterval(fetchOilPriceData, settings.refreshInterval * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [settings.refreshInterval]); // Re-create interval when refresh interval changes

  // Determine if price change is positive
  const isPositive = priceData.priceChange >= 0;

  // Price chart data - last 7 days
  const priceChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Oil Price (USD)',
        data: [66.24, 66.85, 67.32, 66.98, 66.45, 66.78, 67.07],
        borderColor: '#2ebd85',
        backgroundColor: 'rgba(46, 189, 133, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#2ebd85',
        pointBorderColor: '#151c2c',
        pointBorderWidth: 2,
      },
    ],
  };

  // Price chart options
  const priceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(45, 55, 72, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(45, 55, 72, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value: string | number) {
            return `$${Number(value).toFixed(2)}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a2235',
        borderColor: '#2a3548',
        borderWidth: 1,
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            return `$${Number(context.raw).toFixed(2)}`;
          },
        },
      },
    },
  };

  // Trend visualization data - monthly changes
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Change (%)',
        data: [2.1, -1.3, 3.5, -0.8, 1.2, 1.25],
        backgroundColor: function(context: ScriptableContext<'bar'>) {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? '#2ebd85' : '#ff5252';
        },
        borderRadius: 4,
      },
    ],
  };

  // Trend visualization options
  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(45, 55, 72, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value: string | number) {
            return `${Number(value)}%`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a2235',
        borderColor: '#2a3548',
        borderWidth: 1,
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            return `${Number(context.raw).toFixed(2)}%`;
          },
        },
      },
    },
  };

  // Forecast visualization data
  const forecastData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Actual Price',
        data: [67.07, null, null, null, null, null],
        borderColor: 'white',
        backgroundColor: 'white',
        pointRadius: 4,
        pointBackgroundColor: 'white',
        pointBorderColor: '#151c2c',
        pointBorderWidth: 2,
      },
      {
        label: 'Forecast (Optimistic)',
        data: [67.07, 68.50, 70.25, 72.50, 71.80, 73.25],
        borderColor: '#2ebd85',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Forecast (Pessimistic)',
        data: [67.07, 66.20, 65.75, 64.30, 63.50, 62.80],
        borderColor: '#ff5252',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  // Forecast visualization options
  const forecastOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(45, 55, 72, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(45, 55, 72, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value: string | number) {
            return `$${Number(value).toFixed(2)}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        borderColor: '#2a3548',
        borderWidth: 1,
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            if (context.raw === null) return '';
            return `${context.dataset.label}: $${Number(context.raw).toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {loading && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(21, 28, 44, 0.7)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: '#1a2235', 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #2a3548', 
              borderTopColor: '#3b82f6', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'white', fontSize: '1rem' }}>Loading oil price data...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#ff5252', 
          color: 'white', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p>{error}</p>
          <button 
            onClick={fetchOilPriceData} 
            style={{ 
              backgroundColor: 'white', 
              color: '#ff5252', 
              border: 'none', 
              borderRadius: '0.25rem', 
              padding: '0.5rem 1rem', 
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(21, 28, 44, 0.7)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: '#1a2235', 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', color: '#94a3b8' }}>Theme</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleSettingsChange('theme', 'dark')}
                  style={{ 
                    flex: '1', 
                    padding: '0.75rem', 
                    borderRadius: '0.25rem', 
                    border: 'none',
                    backgroundColor: settings.theme === 'dark' ? '#3b82f6' : '#2a3548',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Dark
                </button>
                <button 
                  onClick={() => handleSettingsChange('theme', 'light')}
                  style={{ 
                    flex: '1', 
                    padding: '0.75rem', 
                    borderRadius: '0.25rem', 
                    border: 'none',
                    backgroundColor: settings.theme === 'light' ? '#3b82f6' : '#2a3548',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Light
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', color: '#94a3b8' }}>Auto-Refresh Interval</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Every {settings.refreshInterval} seconds</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="300" 
                  step="10" 
                  value={settings.refreshInterval} 
                  onChange={(e) => handleSettingsChange('refreshInterval', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>10s</span>
                  <span>60s</span>
                  <span>300s</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', color: '#94a3b8' }}>Chart Options</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.chartAnimation} 
                    onChange={(e) => handleSettingsChange('chartAnimation', e.target.checked)}
                  />
                  <span>Enable chart animations</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.showVolatilityIndicator} 
                    onChange={(e) => handleSettingsChange('showVolatilityIndicator', e.target.checked)}
                  />
                  <span>Show volatility indicator</span>
                </label>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.25rem', 
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Oil Price Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: '#1a2235', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.25rem', 
            fontSize: '0.875rem', 
            color: '#94a3b8' 
          }}>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            style={{ 
              backgroundColor: '#1a2235', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.25rem', 
              padding: '0.5rem 1rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </button>
          <button 
            onClick={fetchOilPriceData} 
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.25rem', 
              padding: '0.5rem 1rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Top row */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {/* Price Overview Card */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Current Price</div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>${priceData.currentPrice.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: isPositive ? '#2ebd85' : '#ff5252' }}>
              {isPositive ? 
                <ArrowUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> : 
                <ArrowDownIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} />
              }
              <span>{isPositive ? '+' : ''}{priceData.priceChange.toFixed(2)} ({priceData.priceChangePercent.toFixed(2)}%)</span>
            </div>
          </div>
          
          {/* Time range selector */}
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#151c2c', 
            borderRadius: '0.25rem', 
            padding: '0.25rem', 
            marginBottom: '1rem',
            overflowX: 'auto'
          }}>
            {(['1D', '1W', '1M', '3M', '6M', '1Y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                style={{
                  flex: '1',
                  backgroundColor: selectedTimeRange === range ? '#2a3548' : 'transparent',
                  color: selectedTimeRange === range ? 'white' : '#94a3b8',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: selectedTimeRange === range ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '3rem',
                  textAlign: 'center'
                }}
              >
                {range}
              </button>
            ))}
          </div>
          
          {/* Price change for selected time range */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#151c2c',
            borderRadius: '0.25rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              {selectedTimeRange} Change
            </span>
            <span style={{ 
              color: historicalPriceData[selectedTimeRange].change >= 0 ? '#2ebd85' : '#ff5252',
              fontWeight: 500
            }}>
              {historicalPriceData[selectedTimeRange].change >= 0 ? '+' : ''}
              {historicalPriceData[selectedTimeRange].change.toFixed(2)} (
              {historicalPriceData[selectedTimeRange].changePercent >= 0 ? '+' : ''}
              {historicalPriceData[selectedTimeRange].changePercent.toFixed(2)}%)
            </span>
          </div>
          
          <div style={{ height: '200px', backgroundColor: '#151c2c', borderRadius: '0.25rem', marginBottom: '1.5rem', padding: '0.5rem' }}>
            <Line data={chartData.priceChartData} options={priceChartOptions} />
          </div>
        </div>

        {/* Price Statistics Card */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
            Price Statistics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Daily Range</span>
              <span>${priceData.dailyLow.toFixed(2)} - ${priceData.dailyHigh.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Weekly Change</span>
              <span style={{ color: priceData.weeklyChange >= 0 ? '#2ebd85' : '#ff5252' }}>
                {priceData.weeklyChange >= 0 ? '+' : ''}{priceData.weeklyChange.toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Monthly Change</span>
              <span style={{ color: priceData.monthlyChange >= 0 ? '#2ebd85' : '#ff5252' }}>
                {priceData.monthlyChange >= 0 ? '+' : ''}{priceData.monthlyChange.toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Yearly Change</span>
              <span style={{ color: priceData.yearlyChange >= 0 ? '#2ebd85' : '#ff5252' }}>
                {priceData.yearlyChange >= 0 ? '+' : ''}{priceData.yearlyChange.toFixed(2)}%
              </span>
            </div>
            <div style={{ height: '120px', backgroundColor: '#151c2c', borderRadius: '0.25rem', marginTop: '0.5rem', padding: '0.5rem' }}>
              <Bar data={chartData.trendData} options={trendOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Price Forecast Card */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
            Price Forecast
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Short-term (1 month)</span>
              <span style={{ color: chartData.forecastData.datasets[0].data[0] >= priceData.currentPrice ? '#2ebd85' : '#ff5252' }}>
                ${chartData.forecastData.datasets[0].data[0].toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Medium-term (3 months)</span>
              <span style={{ color: chartData.forecastData.datasets[0].data[2] >= priceData.currentPrice ? '#2ebd85' : '#ff5252' }}>
                ${chartData.forecastData.datasets[0].data[2].toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Long-term (6 months)</span>
              <span style={{ color: chartData.forecastData.datasets[0].data[5] >= priceData.currentPrice ? '#2ebd85' : '#ff5252' }}>
                ${chartData.forecastData.datasets[0].data[5].toFixed(2)}
              </span>
            </div>
            <div style={{ height: '150px', backgroundColor: '#151c2c', borderRadius: '0.25rem', marginTop: '0.5rem', padding: '0.5rem' }}>
              <Line data={chartData.forecastData} options={forecastOptions} />
            </div>
          </div>
        </div>

        {/* Market News Card */}
        <div style={{ flex: '1 1 400px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
            Market News
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newsData.map((news, index) => (
              <div key={index} style={{ 
                borderBottom: index < newsData.length - 1 ? '1px solid #2a3548' : 'none', 
                paddingBottom: '0.75rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>{news.title}</h3>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    backgroundColor: news.impact === 'Bullish' ? 'rgba(46, 189, 133, 0.2)' : 'rgba(255, 82, 82, 0.2)',
                    color: news.impact === 'Bullish' ? '#2ebd85' : '#ff5252'
                  }}>
                    {news.impact}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{news.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePriceDisplay; 