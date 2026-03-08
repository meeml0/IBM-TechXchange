// components/ScopeEmissions.tsx - English version
'use client';

import React from 'react';
import { Factory, Zap, Globe } from 'lucide-react';
import { EmissionData } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface ScopeEmissionsProps {
  t: any;
  emissions: EmissionData[];
}

// Default English translations
const defaultTranslations = {
  metrics: {
    scope1: 'Scope 1 Emissions',
    scope2: 'Scope 2 Emissions', 
    scope3: 'Scope 3 Emissions'
  },
  scope: {
    directEmissions: 'Direct emissions',
    energyConsumption: 'Energy consumption',
    otherEmissions: 'Other emissions',
    fuelConsumption: 'Fuel combustion',
    processEmissions: 'Industrial processes',
    electricity: 'Electricity consumption',
    renewableRatio: 'Renewable energy ratio',
    supplyChain: 'Purchased goods/services',
    businessTravel: 'Business travel',
    dataQuality: 'Data Quality'
  }
};

export default function ScopeEmissions({ t, emissions }: ScopeEmissionsProps) {
  const currentEmission = emissions[0];

  // Safe translation access with fallbacks
  const translations = {
    ...defaultTranslations,
    ...t,
    metrics: {
      ...defaultTranslations.metrics,
      ...(t?.metrics || {})
    },
    scope: {
      ...defaultTranslations.scope,
      ...(t?.scope || {})
    }
  };

  if (!currentEmission) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 p-6 border border-gray-200 dark:border-gray-700 rounded-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Real data calculations
  const scope1Total = currentEmission.scope1_total_co2_kg || 0;
  const scope2Total = currentEmission.scope2_location_based || currentEmission.scope2_market_based || 0;
  const scope3Total = currentEmission.scope3_total_co2_kg || 0;

  const scopeData = [
    {
      title: translations.metrics.scope1,
      icon: Factory,
      value: CarbonAnalysisService.formatCO2(scope1Total),
      description: translations.scope.directEmissions,
      details: [
        { 
          label: translations.scope.fuelConsumption, 
          value: CarbonAnalysisService.formatCO2(currentEmission.scope1_fuel_combustion || 0)
        },
        { 
          label: translations.scope.processEmissions, 
          value: CarbonAnalysisService.formatCO2(currentEmission.scope1_industrial_processes || 0)
        }
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'group-hover:border-red-300 dark:group-hover:border-red-600'
    },
    {
      title: translations.metrics.scope2,
      icon: Zap,
      value: CarbonAnalysisService.formatCO2(scope2Total),
      description: translations.scope.energyConsumption,
      details: [
        { 
          label: translations.scope.electricity, 
          value: `${CarbonAnalysisService.formatNumber(currentEmission.electricity_consumption_kwh || 0)} kWh`
        },
        { 
          label: translations.scope.renewableRatio, 
          value: `${(currentEmission.renewable_energy_percentage || 0).toFixed(1)}%`
        }
      ],
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'group-hover:border-yellow-300 dark:group-hover:border-yellow-600'
    },
    {
      title: translations.metrics.scope3,
      icon: Globe,
      value: CarbonAnalysisService.formatCO2(scope3Total),
      description: translations.scope.otherEmissions,
      details: [
        { 
          label: translations.scope.supplyChain, 
          value: CarbonAnalysisService.formatCO2(currentEmission.scope3_purchased_goods || 0)
        },
        { 
          label: translations.scope.businessTravel, 
          value: CarbonAnalysisService.formatCO2(currentEmission.scope3_business_travel || 0)
        }
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'group-hover:border-blue-300 dark:group-hover:border-blue-600'
    }
  ];

  // Calculate total emissions for percentage calculation
  const totalEmissions = scope1Total + scope2Total + scope3Total;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {scopeData.map((scope, index) => {
        const scopeValue = index === 0 ? scope1Total : index === 1 ? scope2Total : scope3Total;
        const percentage = totalEmissions > 0 ? (scopeValue / totalEmissions) * 100 : 0;
        
        return (
          <div 
            key={index} 
            className={`group bg-white dark:bg-neutral-800 p-6 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-emerald-300 dark:hover:border-emerald-600 ${scope.borderColor} transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{scope.title}</h3>
              <div className={`w-8 h-8 ${scope.bgColor} rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <scope.icon className={`w-4 h-4 ${scope.color}`} />
              </div>
            </div>
            
            <div className="text-2xl font-light text-gray-900 dark:text-white mb-1">{scope.value}</div>
            
            {/* Percentage of total emissions */}
            <div className={`text-sm font-medium ${scope.color} mb-2`}>
              {percentage.toFixed(1)}% of total emissions
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scope.description}</div>
            
            <div className="space-y-2">
              {scope.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{detail.label}</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
            
            {/* Progress bar showing relative size */}
            <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-1000 ${
                  index === 0 ? 'bg-red-500' : 
                  index === 1 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{width: `${Math.min(100, percentage)}%`}}
              ></div>
            </div>
            
            {/* Data quality indicator */}
            {currentEmission.data_quality_score && (
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{translations.scope.dataQuality}</span>
                  <span className={`font-medium ${
                    currentEmission.data_quality_score >= 90 ? 'text-emerald-600' :
                    currentEmission.data_quality_score >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(currentEmission.data_quality_score)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}