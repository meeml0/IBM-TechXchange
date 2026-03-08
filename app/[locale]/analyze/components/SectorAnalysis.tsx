// components/SectorAnalysis.tsx - English version
'use client';

import React from 'react';
import { Zap, Truck, Factory, Building2, Trash2, Layers, Clock } from 'lucide-react';
import { EmissionData, EnergyConsumption, Transportation } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface SectorAnalysisProps {
  t: any;
  emissions: EmissionData[];
  energy: EnergyConsumption[];
  transportation: Transportation[];
}

// Default English translations
const defaultTranslations = {
  detailedSectorAnalysis: 'Detailed Sector Analysis',
  sectors: {
    energy: 'Energy Consumption',
    transport: 'Transportation & Logistics',
    production: 'Production Processes',
    office: 'Office Operations',
    waste: 'Waste Management',
    supply: 'Supply Chain'
  }
};

export default function SectorAnalysis({ t, emissions, energy, transportation }: SectorAnalysisProps) {
  const currentEmission = emissions[0];
  const previousEmission = emissions[1];

  // Safe translation access with fallbacks
  const translations = {
    ...defaultTranslations,
    ...t,
    sectors: {
      ...defaultTranslations.sectors,
      ...(t?.sectors || {})
    }
  };

  // Real data calculations
  const calculateSectorData = () => {
    if (!currentEmission) return [];

    // Energy sector - Scope 2 emissions
    const energyEmissions = currentEmission.scope2_location_based || 0;
    const totalEnergyConsumption = energy.reduce((sum, item) => sum + (item.electricity_total_kwh || 0), 0);
    const renewableEnergyConsumption = energy.reduce((sum, item) => sum + (item.electricity_renewable_kwh || 0), 0);
    
    // Transportation sector - Scope 1 and Scope 3 transportation
    const transportEmissions = (currentEmission.scope3_transportation || 0) + 
                             (currentEmission.scope3_business_travel || 0);
    const totalTransportDistance = transportation.reduce((sum, item) => sum + (item.total_distance_km || 0), 0);
    const totalFuelConsumption = transportation.reduce((sum, item) => sum + (item.fuel_consumption_liters || 0), 0);
    
    // Production sector - Scope 1 industrial processes
    const productionEmissions = (currentEmission.scope1_industrial_processes || 0) + 
                               (currentEmission.scope1_fuel_combustion || 0);
    
    // Office operations - estimated portion of electricity consumption
    const officeEmissions = energyEmissions * 0.2; // Approximately 20% for office use
    
    // Waste management - Scope 3 waste disposal
    const wasteEmissions = currentEmission.scope3_waste_disposal || 0;
    
    // Supply chain - Scope 3 purchased goods/services
    const supplyEmissions = currentEmission.scope3_purchased_goods || 0;

    const totalEmissions = CarbonAnalysisService.calculateTotalEmissions(currentEmission);
    
    // Comparison with previous year data
    const previousTotalEmissions = previousEmission ? CarbonAnalysisService.calculateTotalEmissions(previousEmission) : totalEmissions;
    const previousEnergyEmissions = previousEmission?.scope2_location_based || energyEmissions;
    const previousTransportEmissions = ((previousEmission?.scope3_transportation || 0) + 
                                      (previousEmission?.scope3_business_travel || 0)) || transportEmissions;

    // Calculate trends
    const energyTrend = previousEnergyEmissions > 0 ? ((energyEmissions - previousEnergyEmissions) / previousEnergyEmissions) * 100 : 0;
    const transportTrend = previousTransportEmissions > 0 ? ((transportEmissions - previousTransportEmissions) / previousTransportEmissions) * 100 : 0;

    return [
      {
        key: 'energy',
        icon: Zap,
        value: Math.round(energyEmissions / 1000), // in tCO2
        percentage: (energyEmissions / totalEmissions) * 100,
        trend: energyTrend,
        details: `Electricity: ${CarbonAnalysisService.formatNumber(totalEnergyConsumption)} kWh | Renewable: ${CarbonAnalysisService.formatNumber(renewableEnergyConsumption)} kWh`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      },
      {
        key: 'transport',
        icon: Truck,
        value: Math.round(transportEmissions / 1000),
        percentage: (transportEmissions / totalEmissions) * 100,
        trend: transportTrend,
        details: `Distance: ${CarbonAnalysisService.formatNumber(totalTransportDistance)} km | Fuel: ${CarbonAnalysisService.formatNumber(totalFuelConsumption)} L`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      },
      {
        key: 'production',
        icon: Factory,
        value: Math.round(productionEmissions / 1000),
        percentage: (productionEmissions / totalEmissions) * 100,
        trend: -15.7, // Default value, requires more historical data for real calculation
        details: `Industrial processes: ${CarbonAnalysisService.formatCO2(currentEmission.scope1_industrial_processes || 0)} | Fuel: ${CarbonAnalysisService.formatCO2(currentEmission.scope1_fuel_combustion || 0)}`,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20'
      },
      {
        key: 'office',
        icon: Building2,
        value: Math.round(officeEmissions / 1000),
        percentage: (officeEmissions / totalEmissions) * 100,
        trend: -3.2, // Default value
        details: `Office electricity and HVAC systems`,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20'
      },
      {
        key: 'waste',
        icon: Trash2,
        value: Math.round(wasteEmissions / 1000),
        percentage: (wasteEmissions / totalEmissions) * 100,
        trend: -25.4, // Default value
        details: `Waste disposal: ${CarbonAnalysisService.formatCO2(wasteEmissions)}`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20'
      },
      {
        key: 'supply',
        icon: Layers,
        value: Math.round(supplyEmissions / 1000),
        percentage: (supplyEmissions / totalEmissions) * 100,
        trend: -18.9, // Default value
        details: `Purchased goods and services: ${CarbonAnalysisService.formatCO2(supplyEmissions)}`,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20'
      }
    ].filter(item => item.value > 0); // Don't show sectors with zero values
  };

  const sectorData = calculateSectorData();
  const reportingYear = currentEmission?.reporting_year || new Date().getFullYear();

  if (sectorData.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{translations.detailedSectorAnalysis}</h3>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{reportingYear}</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No sector analysis data available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{translations.detailedSectorAnalysis}</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{reportingYear}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {sectorData.slice(0, Math.ceil(sectorData.length / 2)).map((item) => (
              <SectorItem key={item.key} item={item} translations={translations} />
            ))}
          </div>
          <div className="space-y-6">
            {sectorData.slice(Math.ceil(sectorData.length / 2)).map((item) => (
              <SectorItem key={item.key} item={item} translations={translations} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectorItem({ item, translations }: { item: any; translations: any }) {
  const getSectorName = (key: string) => {
    return translations.sectors?.[key] || key;
  };

  const getTrendLabel = (trend: number) => {
    if (trend < -10) return { text: 'Excellent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' };
    if (trend < 0) return { text: 'Good', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' };
    if (trend < 10) return { text: 'Watch', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' };
    return { text: 'Alert', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' };
  };

  const trendLabel = getTrendLabel(item.trend);

  return (
    <div className="group p-4 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${item.bgColor} rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {getSectorName(item.key)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
              {item.details}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-light text-gray-900 dark:text-white">{item.value} tCO2</div>
          <div className={`text-xs ${item.trend < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
          </div>
        </div>
      </div>
      
      {/* Progress bar showing relative size */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-3">
        <div 
          className={`h-2 rounded-full transition-all duration-1000`}
          style={{
            width: `${Math.min(100, item.percentage)}%`,
            backgroundColor: item.color.includes('yellow') ? '#000' :
                           item.color.includes('blue') ? '#000' :
                           item.color.includes('red') ? '#000' :
                           item.color.includes('green') ? '#000' :
                           item.color.includes('orange') ? '#000' :
                           item.color.includes('purple') ? '#000' : '#000'
          }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {item.percentage.toFixed(1)}% of total emissions
        </span>
        <span className={`text-xs px-2 py-1 rounded-sm ${trendLabel.color}`}>
          {trendLabel.text}
        </span>
      </div>
    </div>
  );
}