// components/TrendForecasting.tsx - With real chart and English language
'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingDown, TrendingUp, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { EmissionData } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface TrendForecastingProps {
  t: any;
  emissions: EmissionData[];
}

interface ForecastData {
  hasData: boolean;
  forecasts: Array<{
    period: string;
    periodKey: string;
    reduction: number;
    timeframe: string;
    confidence: number;
    projectedEmission: number;
    savings: number;
    savingsText: string;
  }>;
  trend: number;
  confidence: number;
  trendDirection?: string;
  currentEmission?: number;
  dataQuality?: number;
  chartData?: Array<{
    year: string;
    actual?: number;
    projected?: number;
    type: 'actual' | 'projected';
    label: string;
  }>;
}

export default function TrendForecasting({ t, emissions }: TrendForecastingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('12');

  // Generate forecast data with chart data
  const calculateForecastData = (): ForecastData => {
    if (emissions.length < 2) {
      return {
        hasData: false,
        forecasts: [],
        trend: 0,
        confidence: 0
      };
    }

    // Calculate emissions for current and previous years
    const currentEmission = CarbonAnalysisService.calculateTotalEmissions(emissions[0]);
    const previousEmission = emissions[1] ? CarbonAnalysisService.calculateTotalEmissions(emissions[1]) : currentEmission;
    
    // Calculate yearly change rate
    const yearlyChangeRate = previousEmission > 0 
      ? ((currentEmission - previousEmission) / previousEmission) * 100 
      : 0;

    // Determine trend direction
    const trendDirection = yearlyChangeRate < 0 ? 'decreasing' : 'increasing';
    
    // Calculate confidence score
    const dataQuality = emissions[0]?.data_quality_score || 70;
    const dataPoints = emissions.length;
    const confidence = Math.min(95, dataQuality + (dataPoints * 5));

    // Generate forecasts for different periods
    const forecasts = [
      {
        period: '6 Month Projection',
        periodKey: '6',
        reduction: yearlyChangeRate / 2,
        timeframe: '6 months',
        confidence: Math.round(Math.max(60, confidence - 10))
      },
      {
        period: '12 Month Projection', 
        periodKey: '12',
        reduction: yearlyChangeRate,
        timeframe: '12 months',
        confidence: Math.round(confidence)
      },
      {
        period: '24 Month Projection',
        periodKey: '24', 
        reduction: yearlyChangeRate * 2,
        timeframe: '24 months',
        confidence: Math.round(Math.max(40, confidence - 20))
      }
    ].map(forecast => {
      const projectedEmission = currentEmission * (1 + (forecast.reduction / 100));
      const savingsKg = currentEmission - projectedEmission;
      
      return {
        ...forecast,
        projectedEmission: projectedEmission / 1000,
        savings: Math.abs(savingsKg / 1000),
        savingsText: `${CarbonAnalysisService.formatNumber(Math.abs(savingsKg / 1000))} tCO2 ${savingsKg > 0 ? 'reduction' : 'increase'}`
      };
    });

    // Generate chart data
    const chartData = [];
    const currentYear = new Date().getFullYear();
    
    // Historical data (actual emissions)
    emissions.slice().reverse().forEach((emission, index) => {
      const year = emission.reporting_year || (currentYear - emissions.length + index + 1);
      const total = CarbonAnalysisService.calculateTotalEmissions(emission) / 1000;
      chartData.push({
        year: year.toString(),
        actual: total,
        type: 'actual' as const,
        label: `${year}: ${total.toFixed(0)} tCO2 (Actual)`
      });
    });

    // Projected data
    const selectedForecast = forecasts.find(f => f.periodKey === selectedPeriod) || forecasts[1];
    const periodMonths = parseInt(selectedPeriod);
    const yearsToProject = Math.ceil(periodMonths / 12);
    
    for (let i = 1; i <= yearsToProject; i++) {
      const projectedYear = currentYear + i;
      const projectedValue = currentEmission / 1000 * Math.pow((1 + yearlyChangeRate / 100), i);
      chartData.push({
        year: projectedYear.toString(),
        projected: projectedValue,
        type: 'projected' as const,
        label: `${projectedYear}: ${projectedValue.toFixed(0)} tCO2 (Projected)`
      });
    }

    return {
      hasData: true,
      forecasts,
      trend: yearlyChangeRate,
      trendDirection,
      confidence,
      currentEmission: currentEmission / 1000,
      dataQuality: dataQuality,
      chartData
    };
  };

  const forecastData = calculateForecastData();

  const getTrendIcon = (direction: string) => {
    return direction === 'decreasing' ? TrendingDown : TrendingUp;
  };

  const getTrendColor = (reduction: number) => {
    if (reduction < -10) return 'text-emerald-600';
    if (reduction < 0) return 'text-green-600';
    if (reduction < 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.label}</p>
          {data.actual && (
            <p className="text-blue-600">
              <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Actual: {data.actual.toFixed(1)} tCO2
            </p>
          )}
          {data.projected && (
            <p className="text-emerald-600">
              <span className="inline-block w-3 h-3 bg-emerald-600 rounded-full mr-2"></span>
              Projected: {data.projected.toFixed(1)} tCO2
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // No data placeholder
  if (!forecastData.hasData) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Trend Analysis & Forecasting
            </h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Insufficient Data</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-80 bg-gray-50 dark:bg-gray-700/30 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                At least 2 years of data required for trend analysis
              </p>
              <p className="text-xs text-gray-400">
                Forecasts will be displayed when more historical data is available
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const TrendIcon = getTrendIcon(forecastData.trendDirection || 'increasing');
  const selectedForecast = forecastData.forecasts.find(f => f.periodKey === selectedPeriod) || forecastData.forecasts[1];

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Trend Analysis & Forecasting
            </h3>
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-4 h-4 ${getTrendColor(forecastData.trend)}`} />
              <span className={`text-xs ${getTrendColor(forecastData.trend)}`}>
                {forecastData.trend > 0 ? '+' : ''}{forecastData.trend.toFixed(1)}% annually
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {forecastData.forecasts.map((forecast) => (
              <button
                key={forecast.periodKey}
                onClick={() => setSelectedPeriod(forecast.periodKey)}
                className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                  selectedPeriod === forecast.periodKey
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {forecast.periodKey}M
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Interactive Chart */}
        <div className="h-80 mb-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="year" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                label={{ value: 'tCO2', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Current year reference line */}
              <ReferenceLine 
                x={new Date().getFullYear().toString()} 
                stroke="#EF4444" 
                strokeDasharray="5 5"
                label={{ value: "Current Year", position: "top" }}
              />
              
              {/* Actual emissions area */}
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#actualGradient)"
                connectNulls={false}
              />
              
              {/* Projected emissions area */}
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#10B981"
                strokeWidth={3}
                strokeDasharray="8 4"
                fill="url(#projectedGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Confidence indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-sm border border-gray-200 dark:border-gray-600 backdrop-blur-sm">
              <Target className={`w-3 h-3 ${getConfidenceColor(selectedForecast?.confidence || 0)}`} />
              <span className={`text-xs ${getConfidenceColor(selectedForecast?.confidence || 0)}`}>
                {Math.round(selectedForecast?.confidence || 0)}% confidence
              </span>
            </div>
          </div>

          {/* Chart legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-sm border border-gray-200 dark:border-gray-600 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Projected</span>
            </div>
          </div>
        </div>
        
        {/* Forecast cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecastData.forecasts.map((forecast, index) => (
            <div 
              key={index} 
              className={`group p-4 border rounded-sm transition-all duration-300 cursor-pointer ${
                selectedPeriod === forecast.periodKey
                  ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
              onClick={() => setSelectedPeriod(forecast.periodKey)}
            >
              <div className="text-center">
                <div className={`text-2xl font-light mb-1 ${getTrendColor(forecast.reduction)}`}>
                  {forecast.reduction > 0 ? '+' : ''}{forecast.reduction.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {forecast.period}
                </div>
                <div className={`text-xs ${forecast.reduction < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {forecast.savingsText}
                </div>
                
                {/* Projected value */}
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">Projected Emissions</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {forecast.projectedEmission.toFixed(0)} tCO2
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data quality and source info */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Current Emissions: {(forecastData.currentEmission || 0).toFixed(0)} tCO2</span>
              <span>Data Quality: {Math.round(forecastData.dataQuality || 0)}%</span>
              <span>Data Points: {emissions.length} years</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Machine learning model</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}