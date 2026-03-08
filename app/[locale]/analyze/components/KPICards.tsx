// components/KPICards.tsx - English with renewable energy debugging
'use client';

import React from 'react';
import { 
  Leaf, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Gauge, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { EmissionData, EnergyConsumption } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface KPICardsProps {
  t: any;
  emissions: EmissionData[];
  energy: EnergyConsumption[];
}

// Default translations to prevent undefined errors
const defaultTranslations = {
  metrics: {
    totalEmissions: 'Total Carbon Emissions',
    monthlyChange: 'Annual Change Rate',
    renewableRatio: 'Renewable Energy Ratio',
    target: 'Net Zero Target Progress',
    monthlyUnit: 'tCO2e / year',
    netZeroTarget: 'to 2025 Net Zero target'
  }
};

export default function KPICards({ t, emissions, energy }: KPICardsProps) {
  // Safe translation access with fallbacks
  const translations = {
    ...defaultTranslations,
    ...t,
    metrics: {
      ...defaultTranslations.metrics,
      ...(t?.metrics || {})
    }
  };

  // Real data calculations
  const currentEmission = emissions[0];
  const previousEmission = emissions[1];
  
  const totalEmissions = currentEmission ? CarbonAnalysisService.calculateTotalEmissions(currentEmission) : 0;
  
  const emissionChange = currentEmission && previousEmission 
    ? CarbonAnalysisService.calculateEmissionChange(currentEmission, previousEmission)
    : 0;
  
  

  const renewableRatio = CarbonAnalysisService.calculateRenewableEnergyRatio(energy);
  
  console.log('[KPICards] Renewable ratio calculation:', {
    renewableRatio,
    totalRenewable: energy.reduce((sum, item) => sum + (item.electricity_renewable_kwh || 0), 0),
    totalConsumption: energy.reduce((sum, item) => sum + (item.electricity_total_kwh || 0), 0)
  });

  // Alternative renewable ratio calculation from emissions data
  const alternativeRenewableRatio = currentEmission?.renewable_energy_percentage || 0;
  
  console.log('[KPICards] Alternative renewable ratio from emissions:', alternativeRenewableRatio);

  // Use the better of the two renewable ratios
  const finalRenewableRatio = Math.max(renewableRatio, alternativeRenewableRatio);
  
  // Net Zero target progress calculation
  const currentYear = new Date().getFullYear();
  const targetYear = 2025;
  const baselineEmissions = 7000; // Baseline emissions (tCO2)
  const targetProgress = Math.max(0, Math.min(100, 
    ((baselineEmissions - totalEmissions/1000) / baselineEmissions) * 100
  ));

  const kpiData = [
    {
      icon: Leaf,
      value: CarbonAnalysisService.formatNumber(totalEmissions/1000), // in tCO2
      trend: emissionChange < 0 ? TrendingDown : TrendingUp,
      title: translations.metrics.totalEmissions,
      subtitle: `${currentEmission?.reporting_year || currentYear} ${translations.metrics.monthlyUnit}`,
      progress: Math.min(100, (totalEmissions/1000) / 50), // 50 tCO2 maximum
      trendClass: emissionChange < 0 ? 'text-emerald-600' : 'text-red-600',
      valueClass: emissionChange < 0 ? 'text-emerald-600' : 'text-gray-900 dark:text-white'
    },
    {
      icon: emissionChange < 0 ? TrendingDown : TrendingUp,
      value: `${emissionChange.toFixed(1)}%`,
      trend: ArrowRight,
      title: translations.metrics.monthlyChange,
      subtitle: emissionChange < 0 
        ? `${Math.abs(emissionChange).toFixed(1)}% reduction from previous year` 
        : `${emissionChange.toFixed(1)}% increase from previous year`,
      progress: Math.abs(emissionChange),
      trendClass: emissionChange < 0 ? 'text-emerald-600' : 'text-red-600',
      valueClass: emissionChange < 0 ? 'text-emerald-600' : 'text-red-600',
      badge: emissionChange < 0 ? 'Improved' : 'Increased'
    },
    {
      icon: Gauge,
      value: `${finalRenewableRatio.toFixed(1)}%`,
      trend: TrendingUp,
      title: translations.metrics.renewableRatio,
      subtitle: energy.length > 0 
        ? `Based on ${energy.length} facility records`
        : alternativeRenewableRatio > 0 
          ? 'From emissions report'
          : 'No energy data available',
      progress: finalRenewableRatio,
      trendClass: 'text-emerald-600',
      subtitleClass: finalRenewableRatio > 50 ? 'text-emerald-600' : 'text-gray-500',

    },
    {
      icon: Target,
      value: `${targetProgress.toFixed(0)}%`,
      trend: CheckCircle,
      title: translations.metrics.target,
      subtitle: `${targetYear} ${translations.metrics.netZeroTarget}`,
      progress: targetProgress,
      trendClass: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <div key={index} className="group bg-white dark:bg-neutral-800 p-6 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
              <kpi.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="flex items-center gap-1">
              <kpi.trend className={`w-4 h-4 ${kpi.trendClass}`} />
              {kpi.badge && (
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <span>{kpi.badge}</span>
                </div>
              )}
            </div>
          </div>
          <div className={`text-3xl font-light mb-2 ${kpi.valueClass || 'text-gray-900 dark:text-white'}`}>
            {kpi.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.title}</div>
          <div className={`text-xs ${kpi.subtitleClass || 'text-gray-500 dark:text-gray-500'}`}>
            {kpi.subtitle}
          </div>
          
         
          
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
            <div 
              className="bg-emerald-500 h-1 rounded-full transition-all duration-1000" 
              style={{width: `${Math.min(100, kpi.progress)}%`}}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}