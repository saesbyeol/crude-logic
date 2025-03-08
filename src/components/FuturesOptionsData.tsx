"use client";

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { Line } from 'react-chartjs-2';

const FuturesOptionsData = () => {
  // Mock data for futures prices
  const [futuresData, setFuturesData] = React.useState({
    wti: [
      { month: 'JUN 23', price: 78.76, change: -0.42, changePercent: -0.53, volume: 324567, openInterest: 287654 },
      { month: 'JUL 23', price: 79.12, change: -0.38, changePercent: -0.48, volume: 198765, openInterest: 176543 },
      { month: 'AUG 23', price: 79.45, change: -0.35, changePercent: -0.44, volume: 145678, openInterest: 132456 },
      { month: 'SEP 23', price: 79.68, change: -0.31, changePercent: -0.39, volume: 98765, openInterest: 87654 },
      { month: 'OCT 23', price: 79.82, change: -0.28, changePercent: -0.35, volume: 76543, openInterest: 65432 },
      { month: 'DEC 23', price: 80.05, change: -0.25, changePercent: -0.31, volume: 54321, openInterest: 43210 }
    ],
    brent: [
      { month: 'JUN 23', price: 82.56, change: -0.38, changePercent: -0.46, volume: 298765, openInterest: 254321 },
      { month: 'JUL 23', price: 82.87, change: -0.35, changePercent: -0.42, volume: 176543, openInterest: 154321 },
      { month: 'AUG 23', price: 83.12, change: -0.32, changePercent: -0.38, volume: 132456, openInterest: 121098 },
      { month: 'SEP 23', price: 83.34, change: -0.29, changePercent: -0.35, volume: 87654, openInterest: 76543 },
      { month: 'OCT 23', price: 83.52, change: -0.26, changePercent: -0.31, volume: 65432, openInterest: 54321 },
      { month: 'DEC 23', price: 83.78, change: -0.23, changePercent: -0.27, volume: 43210, openInterest: 32109 }
    ]
  });

  // Mock data for options chain
  const [optionsData, setOptionsData] = React.useState({
    calls: [
      { strike: 75.00, last: 4.32, change: 0.18, bid: 4.28, ask: 4.36, volume: 12543, openInt: 34567, delta: 0.68, gamma: 0.04, theta: -0.05, vega: 0.12, impliedVol: 28.5 },
      { strike: 77.50, last: 2.65, change: -0.22, bid: 2.61, ask: 2.69, volume: 8765, openInt: 23456, delta: 0.52, gamma: 0.06, theta: -0.06, vega: 0.14, impliedVol: 26.8 },
      { strike: 80.00, last: 1.48, change: -0.35, bid: 1.45, ask: 1.51, volume: 15432, openInt: 45678, delta: 0.38, gamma: 0.07, theta: -0.07, vega: 0.15, impliedVol: 25.2 },
      { strike: 82.50, last: 0.76, change: -0.28, bid: 0.74, ask: 0.78, volume: 7654, openInt: 21098, delta: 0.24, gamma: 0.05, theta: -0.06, vega: 0.12, impliedVol: 24.5 },
      { strike: 85.00, last: 0.35, change: -0.15, bid: 0.34, ask: 0.36, volume: 5432, openInt: 15678, delta: 0.14, gamma: 0.03, theta: -0.04, vega: 0.08, impliedVol: 23.8 }
    ],
    puts: [
      { strike: 75.00, last: 0.41, change: -0.08, bid: 0.40, ask: 0.42, volume: 6543, openInt: 18765, delta: -0.12, gamma: 0.03, theta: -0.03, vega: 0.07, impliedVol: 24.2 },
      { strike: 77.50, last: 0.98, change: 0.12, bid: 0.96, ask: 1.00, volume: 8765, openInt: 25432, delta: -0.28, gamma: 0.05, theta: -0.05, vega: 0.11, impliedVol: 25.1 },
      { strike: 80.00, last: 2.12, change: 0.24, bid: 2.09, ask: 2.15, volume: 12345, openInt: 32109, delta: -0.42, gamma: 0.06, theta: -0.06, vega: 0.14, impliedVol: 26.3 },
      { strike: 82.50, last: 3.85, change: 0.32, bid: 3.81, ask: 3.89, volume: 7654, openInt: 21987, delta: -0.58, gamma: 0.05, theta: -0.05, vega: 0.13, impliedVol: 27.2 },
      { strike: 85.00, last: 5.92, change: 0.28, bid: 5.87, ask: 5.97, volume: 5432, openInt: 16789, delta: -0.72, gamma: 0.04, theta: -0.04, vega: 0.11, impliedVol: 28.4 }
    ],
    expiryDate: 'June 16, 2023',
    daysToExpiry: 42,
    underlyingPrice: 78.76
  });

  // Mock data for term structure
  const termStructureData = {
    labels: ['JUN 23', 'JUL 23', 'AUG 23', 'SEP 23', 'OCT 23', 'DEC 23'],
    datasets: [
      {
        label: 'WTI Futures',
        data: futuresData.wti.map(contract => contract.price),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
      {
        label: 'Brent Futures',
        data: futuresData.brent.map(contract => contract.price),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6',
      },
    ],
  };

  // Chart options for term structure
  const termStructureOptions = {
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
        display: true,
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        borderColor: '#2a3548',
        borderWidth: 1,
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${Number(context.raw).toFixed(2)}`;
          },
        },
      },
    },
  };

  // State for active tab
  const [activeTab, setActiveTab] = React.useState<'wti' | 'brent'>('wti');
  const [optionsType, setOptionsType] = React.useState<'calls' | 'puts'>('calls');

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
      {/* Futures Prices Card */}
      <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
          Crude Oil Futures Prices
        </h2>
        
        {/* Tabs for WTI/Brent */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#151c2c', 
          borderRadius: '0.25rem', 
          padding: '0.25rem', 
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('wti')}
            style={{
              flex: '1',
              backgroundColor: activeTab === 'wti' ? '#2a3548' : 'transparent',
              color: activeTab === 'wti' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'wti' ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            WTI Crude
          </button>
          <button
            onClick={() => setActiveTab('brent')}
            style={{
              flex: '1',
              backgroundColor: activeTab === 'brent' ? '#2a3548' : 'transparent',
              color: activeTab === 'brent' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'brent' ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Brent Crude
          </button>
        </div>
        
        {/* Term Structure Chart */}
        <div style={{ height: '180px', backgroundColor: '#151c2c', borderRadius: '0.25rem', marginBottom: '1rem', padding: '0.5rem' }}>
          <Line data={termStructureData} options={termStructureOptions} />
        </div>
        
        {/* Futures Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3548' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#94a3b8' }}>Month</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Change</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Volume</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Open Int.</th>
              </tr>
            </thead>
            <tbody>
              {futuresData[activeTab].map((contract, index) => (
                <tr key={index} style={{ borderBottom: index < futuresData[activeTab].length - 1 ? '1px solid #2a3548' : 'none' }}>
                  <td style={{ padding: '0.5rem', fontWeight: index === 0 ? 500 : 400 }}>{contract.month}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>${contract.price.toFixed(2)}</td>
                  <td style={{ 
                    textAlign: 'right', 
                    padding: '0.5rem',
                    color: contract.change >= 0 ? '#2ebd85' : '#ff5252',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                    {contract.change >= 0 ? 
                      <ArrowUpIcon style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }} /> : 
                      <ArrowDownIcon style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }} />
                    }
                    {contract.change >= 0 ? '+' : ''}{contract.change.toFixed(2)} ({contract.changePercent.toFixed(2)}%)
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>{contract.volume.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: '0.5rem' }}>{contract.openInterest.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Options Chain Card */}
      <div style={{ flex: '1 1 600px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500 }}>
            Options Chain with Greeks
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: '#94a3b8' }}>Expiry:</span>
            <span>{optionsData.expiryDate}</span>
            <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>DTE:</span>
            <span>{optionsData.daysToExpiry}</span>
          </div>
        </div>
        
        {/* Tabs for Calls/Puts */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#151c2c', 
          borderRadius: '0.25rem', 
          padding: '0.25rem', 
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setOptionsType('calls')}
            style={{
              flex: '1',
              backgroundColor: optionsType === 'calls' ? '#2a3548' : 'transparent',
              color: optionsType === 'calls' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: optionsType === 'calls' ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Calls
          </button>
          <button
            onClick={() => setOptionsType('puts')}
            style={{
              flex: '1',
              backgroundColor: optionsType === 'puts' ? '#2a3548' : 'transparent',
              color: optionsType === 'puts' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: optionsType === 'puts' ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Puts
          </button>
        </div>
        
        <div style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: '#151c2c', borderRadius: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Underlying Price:</span>
            <span style={{ fontWeight: 500 }}>${optionsData.underlyingPrice.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Options Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3548' }}>
                <th style={{ textAlign: 'center', padding: '0.5rem', color: '#94a3b8' }}>Strike</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Last</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Change</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Bid</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Ask</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Volume</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>OI</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>IV</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Delta</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Gamma</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Theta</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', color: '#94a3b8' }}>Vega</th>
              </tr>
            </thead>
            <tbody>
              {optionsData[optionsType].map((option, index) => {
                const isInTheMoney = optionsType === 'calls' 
                  ? option.strike < optionsData.underlyingPrice 
                  : option.strike > optionsData.underlyingPrice;
                
                return (
                  <tr key={index} style={{ 
                    borderBottom: index < optionsData[optionsType].length - 1 ? '1px solid #2a3548' : 'none',
                    backgroundColor: isInTheMoney ? 'rgba(46, 189, 133, 0.05)' : 'transparent'
                  }}>
                    <td style={{ 
                      textAlign: 'center', 
                      padding: '0.5rem', 
                      fontWeight: 500,
                      color: isInTheMoney ? '#2ebd85' : 'white'
                    }}>
                      ${option.strike.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>${option.last.toFixed(2)}</td>
                    <td style={{ 
                      textAlign: 'right', 
                      padding: '0.5rem',
                      color: option.change >= 0 ? '#2ebd85' : '#ff5252'
                    }}>
                      {option.change >= 0 ? '+' : ''}{option.change.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>${option.bid.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>${option.ask.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.volume.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.openInt.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.impliedVol.toFixed(1)}%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.delta.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.gamma.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.theta.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{option.vega.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#151c2c', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>Greeks Explained:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: '1 1 45%' }}>
              <span style={{ fontWeight: 500 }}>Delta:</span> Measures change in option price per $1 change in underlying
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <span style={{ fontWeight: 500 }}>Gamma:</span> Rate of change in delta per $1 move in underlying
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <span style={{ fontWeight: 500 }}>Theta:</span> Time decay; option value lost per day
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <span style={{ fontWeight: 500 }}>Vega:</span> Change in option price per 1% change in implied volatility
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturesOptionsData; 