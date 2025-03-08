"use client";

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { Bar } from 'react-chartjs-2';

const GlobalSupplyDemand = () => {
  // Mock data for OPEC production
  const [opecData, setOpecData] = React.useState({
    currentProduction: 28.6, // in million barrels per day
    previousProduction: 29.2,
    productionChange: -0.6,
    productionChangePercent: -2.05,
    quotaCompliance: 92, // percentage
    nextMeeting: "June 1, 2023",
    recentDecisions: [
      {
        date: "April 2, 2023",
        decision: "Production cut of 1.16 million barrels per day",
        impact: "Bullish"
      },
      {
        date: "March 5, 2023",
        decision: "Maintained existing production quotas",
        impact: "Neutral"
      },
      {
        date: "February 1, 2023",
        decision: "Increased production by 400,000 barrels per day",
        impact: "Bearish"
      }
    ]
  });

  // Mock data for US Crude Oil Inventory
  const [inventoryData, setInventoryData] = React.useState({
    currentLevel: 432.8, // in million barrels
    previousLevel: 435.4,
    change: -2.6,
    changePercent: -0.6,
    fiveYearAverage: 450.2,
    comparedToAverage: -3.87, // percentage difference from 5-year average
    weeklyReports: [
      {
        date: "April 26, 2023",
        actual: -2.6,
        forecast: -1.8,
        impact: "Bullish"
      },
      {
        date: "April 19, 2023",
        actual: 1.3,
        forecast: 1.5,
        impact: "Neutral"
      },
      {
        date: "April 12, 2023",
        actual: 4.1,
        forecast: 2.5,
        impact: "Bearish"
      }
    ]
  });

  // Mock data for Shipping & Supply Chain
  const [shippingData, setShippingData] = React.useState({
    tankerRates: {
      current: 42.5, // Worldscale points
      previous: 38.2,
      change: 4.3,
      changePercent: 11.26
    },
    majorExports: [
      {
        region: "Middle East",
        volume: 18.2, // million barrels per day
        changePercent: 2.8
      },
      {
        region: "Russia",
        volume: 7.4,
        changePercent: -5.1
      },
      {
        region: "US",
        volume: 3.6,
        changePercent: 8.4
      }
    ],
    majorImports: [
      {
        region: "China",
        volume: 11.8,
        changePercent: 3.5
      },
      {
        region: "Europe",
        volume: 9.2,
        changePercent: -2.1
      },
      {
        region: "India",
        volume: 5.1,
        changePercent: 12.6
      }
    ],
    supplyDisruptions: [
      {
        region: "Libya",
        issue: "Port blockade",
        impact: "400,000 bpd reduction",
        status: "Ongoing"
      },
      {
        region: "Nigeria",
        issue: "Pipeline sabotage",
        impact: "200,000 bpd reduction",
        status: "Partially resolved"
      }
    ]
  });

  // Chart data for inventory levels
  const inventoryChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Weekly Inventory Change (million barrels)',
        data: [-2.6, 1.3, 4.1, -1.8, -3.2, 2.1],
        backgroundColor: function(context: any) {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? '#ff5252' : '#2ebd85'; // Inverse colors because lower inventory is bullish
        },
        borderRadius: 4,
      },
    ],
  };

  // Chart options for inventory
  const inventoryChartOptions = {
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
      },
    },
  };

  // Chart data for exports/imports
  const tradeFlowChartData = {
    labels: ['Middle East', 'Russia', 'US', 'China', 'Europe', 'India'],
    datasets: [
      {
        label: 'Export Volume',
        data: [18.2, 7.4, 3.6, 0, 0, 0],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        stack: 'Stack 0',
      },
      {
        label: 'Import Volume',
        data: [0, 0, 0, 11.8, 9.2, 5.1],
        backgroundColor: '#2ebd85',
        borderRadius: 4,
        stack: 'Stack 1',
      },
    ],
  };

  // Chart options for trade flows
  const tradeFlowChartOptions = {
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
            return `${value} mb/d`;
          },
        },
        stacked: false,
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
      },
    },
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
      {/* OPEC Production Card */}
      <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
          OPEC Production Updates
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Current Production</span>
            <span>{opecData.currentProduction.toFixed(1)} mb/d</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Production Change</span>
            <div style={{ display: 'flex', alignItems: 'center', color: opecData.productionChange >= 0 ? '#ff5252' : '#2ebd85' }}>
              {opecData.productionChange >= 0 ? 
                <ArrowUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> : 
                <ArrowDownIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} />
              }
              <span>{opecData.productionChange >= 0 ? '+' : ''}{opecData.productionChange.toFixed(1)} mb/d ({opecData.productionChangePercent.toFixed(1)}%)</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Quota Compliance</span>
            <span>{opecData.quotaCompliance}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Next Meeting</span>
            <span>{opecData.nextMeeting}</span>
          </div>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.5rem', color: '#94a3b8' }}>Recent Decisions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {opecData.recentDecisions.map((decision, index) => (
              <div key={index} style={{ 
                padding: '0.75rem', 
                backgroundColor: '#151c2c', 
                borderRadius: '0.25rem',
                borderLeft: `3px solid ${
                  decision.impact === 'Bullish' ? '#2ebd85' : 
                  decision.impact === 'Bearish' ? '#ff5252' : '#94a3b8'
                }`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{decision.decision}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    backgroundColor: decision.impact === 'Bullish' ? 'rgba(46, 189, 133, 0.2)' : 
                                    decision.impact === 'Bearish' ? 'rgba(255, 82, 82, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    color: decision.impact === 'Bullish' ? '#2ebd85' : 
                           decision.impact === 'Bearish' ? '#ff5252' : '#94a3b8'
                  }}>
                    {decision.impact}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{decision.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* US Crude Oil Inventory Card */}
      <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
          US Crude Oil Inventory (EIA)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Current Level</span>
            <span>{inventoryData.currentLevel.toFixed(1)} million barrels</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Weekly Change</span>
            <div style={{ display: 'flex', alignItems: 'center', color: inventoryData.change >= 0 ? '#ff5252' : '#2ebd85' }}>
              {inventoryData.change >= 0 ? 
                <ArrowUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> : 
                <ArrowDownIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} />
              }
              <span>{inventoryData.change >= 0 ? '+' : ''}{inventoryData.change.toFixed(1)} mb ({inventoryData.changePercent.toFixed(1)}%)</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>vs. 5-Year Average</span>
            <div style={{ display: 'flex', alignItems: 'center', color: inventoryData.comparedToAverage >= 0 ? '#ff5252' : '#2ebd85' }}>
              {inventoryData.comparedToAverage >= 0 ? 
                <ArrowUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> : 
                <ArrowDownIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} />
              }
              <span>{inventoryData.comparedToAverage >= 0 ? '+' : ''}{inventoryData.comparedToAverage.toFixed(1)}%</span>
            </div>
          </div>
          
          <div style={{ height: '150px', backgroundColor: '#151c2c', borderRadius: '0.25rem', marginTop: '0.5rem', marginBottom: '1rem', padding: '0.5rem' }}>
            <Bar data={inventoryChartData} options={inventoryChartOptions} />
          </div>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.5rem', color: '#94a3b8' }}>Recent EIA Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {inventoryData.weeklyReports.map((report, index) => (
              <div key={index} style={{ 
                padding: '0.75rem', 
                backgroundColor: '#151c2c', 
                borderRadius: '0.25rem',
                borderLeft: `3px solid ${
                  report.impact === 'Bullish' ? '#2ebd85' : 
                  report.impact === 'Bearish' ? '#ff5252' : '#94a3b8'
                }`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Actual: {report.actual >= 0 ? '+' : ''}{report.actual.toFixed(1)} mb
                  </span>
                  <span style={{ fontSize: '0.875rem' }}>
                    Forecast: {report.forecast >= 0 ? '+' : ''}{report.forecast.toFixed(1)} mb
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{report.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shipping & Supply Chain Card */}
      <div style={{ flex: '1 1 300px', backgroundColor: '#1a2235', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid #2a3548', paddingBottom: '0.5rem' }}>
          Shipping & Supply Chain Analytics
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Tanker Rates (Worldscale)</span>
            <div style={{ display: 'flex', alignItems: 'center', color: shippingData.tankerRates.change >= 0 ? '#2ebd85' : '#ff5252' }}>
              {shippingData.tankerRates.change >= 0 ? 
                <ArrowUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> : 
                <ArrowDownIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} />
              }
              <span>{shippingData.tankerRates.current.toFixed(1)} ({shippingData.tankerRates.change >= 0 ? '+' : ''}{shippingData.tankerRates.changePercent.toFixed(1)}%)</span>
            </div>
          </div>
          
          <div style={{ height: '180px', backgroundColor: '#151c2c', borderRadius: '0.25rem', marginTop: '0.5rem', marginBottom: '1rem', padding: '0.5rem' }}>
            <Bar data={tradeFlowChartData} options={tradeFlowChartOptions} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 45%' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem', color: '#94a3b8' }}>Major Exporters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {shippingData.majorExports.map((exporter, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem', 
                    backgroundColor: '#151c2c', 
                    borderRadius: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem' }}>{exporter.region}</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>{exporter.volume.toFixed(1)} mb/d</span>
                      <span style={{ 
                        fontSize: '0.75rem',
                        color: exporter.changePercent >= 0 ? '#2ebd85' : '#ff5252'
                      }}>
                        {exporter.changePercent >= 0 ? '+' : ''}{exporter.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ flex: '1 1 45%' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem', color: '#94a3b8' }}>Major Importers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {shippingData.majorImports.map((importer, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem', 
                    backgroundColor: '#151c2c', 
                    borderRadius: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem' }}>{importer.region}</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>{importer.volume.toFixed(1)} mb/d</span>
                      <span style={{ 
                        fontSize: '0.75rem',
                        color: importer.changePercent >= 0 ? '#2ebd85' : '#ff5252'
                      }}>
                        {importer.changePercent >= 0 ? '+' : ''}{importer.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.75rem', marginBottom: '0.75rem', color: '#94a3b8' }}>Supply Disruptions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {shippingData.supplyDisruptions.map((disruption, index) => (
              <div key={index} style={{ 
                padding: '0.75rem', 
                backgroundColor: '#151c2c', 
                borderRadius: '0.25rem',
                borderLeft: '3px solid #ff5252'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{disruption.region}: {disruption.issue}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    backgroundColor: disruption.status === 'Ongoing' ? 'rgba(255, 82, 82, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    color: disruption.status === 'Ongoing' ? '#ff5252' : '#94a3b8'
                  }}>
                    {disruption.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{disruption.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSupplyDemand; 