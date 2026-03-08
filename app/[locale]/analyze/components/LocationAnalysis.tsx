// components/LocationAnalysis.tsx - Revize edilmiş versiyon
'use client';

import React from 'react';
import { MapPin, Building, Factory, Warehouse, Store } from 'lucide-react';
import { EnergyConsumption } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface LocationAnalysisProps {
  t: any;
  energy: EnergyConsumption[];
}

export default function LocationAnalysis({ t, energy }: LocationAnalysisProps) {
  // Gerçek enerji verilerinden lokasyon analizi oluştur
  const calculateLocationData = () => {
    if (energy.length === 0) return [];

    // Tesisleri facility_name'e göre grupla
    const facilityGroups = energy.reduce((acc, item) => {
      const facilityName = item.facility_name || 'Bilinmeyen Tesis';
      if (!acc[facilityName]) {
        acc[facilityName] = [];
      }
      acc[facilityName].push(item);
      return acc;
    }, {} as { [key: string]: EnergyConsumption[] });

    // Her tesis için emisyon hesapla
    const locationData = Object.entries(facilityGroups).map(([facilityName, facilities]) => {
      const totalElectricity = facilities.reduce((sum, f) => sum + (f.electricity_total_kwh || 0), 0);
      const totalRenewable = facilities.reduce((sum, f) => sum + (f.electricity_renewable_kwh || 0), 0);
      const totalGas = facilities.reduce((sum, f) => sum + (f.natural_gas_m3 || 0), 0);
      
      // Emisyon hesaplama (yaklaşık katsayılar)
      const electricityEmissions = totalElectricity * 0.5; // kg CO2/kWh
      const gasEmissions = totalGas * 2.3; // kg CO2/m3
      const totalEmissions = electricityEmissions + gasEmissions;

      // Tesis tipini belirle
      const facilityType = determineFacilityType(facilityName);
      const renewableRatio = totalElectricity > 0 ? (totalRenewable / totalElectricity) * 100 : 0;
      const status = getPerformanceStatus(renewableRatio, totalEmissions);

      return {
        location: facilityName,
        value: Math.round(totalEmissions),
        percentage: 0, // Toplam yüzde hesaplanacak
        status,
        details: {
          electricity: totalElectricity,
          renewable: totalRenewable,
          gas: totalGas,
          renewableRatio,
          facilityType
        }
      };
    });

    // Yüzde hesaplama
    const totalEmissions = locationData.reduce((sum, item) => sum + item.value, 0);
    locationData.forEach(item => {
      item.percentage = totalEmissions > 0 ? (item.value / totalEmissions) * 100 : 0;
    });

    // En yüksek emisyondan en düşüğe sırala
    return locationData.sort((a, b) => b.value - a.value).slice(0, 5);
  };

  const determineFacilityType = (facilityName: string): string => {
    const name = facilityName.toLowerCase();
    if (name.includes('merkez') || name.includes('headquarters') || name.includes('hq')) {
      return 'headquarters';
    } else if (name.includes('üretim') || name.includes('fabrika') || name.includes('production') || name.includes('factory')) {
      return 'production';
    } else if (name.includes('ofis') || name.includes('office') || name.includes('şube')) {
      return 'offices';
    } else if (name.includes('depo') || name.includes('warehouse') || name.includes('storage')) {
      return 'warehouses';
    } else if (name.includes('mağaza') || name.includes('store') || name.includes('retail')) {
      return 'retail';
    }
    return 'offices';
  };

  const getPerformanceStatus = (renewableRatio: number, emissions: number): string => {
    if (renewableRatio >= 80 && emissions < 1000) return 'excellent';
    if (renewableRatio >= 50 && emissions < 2000) return 'good';
    if (renewableRatio >= 20 || emissions < 5000) return 'moderate';
    return 'needsImprovement';
  };

  const getFacilityIcon = (facilityType: string) => {
    switch (facilityType) {
      case 'headquarters':
        return Building;
      case 'production':
        return Factory;
      case 'warehouses':
        return Warehouse;
      case 'retail':
        return Store;
      default:
        return Building;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
      case 'good':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'needsImprovement':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      excellent: 'Mükemmel',
      good: 'İyi',
      moderate: 'Orta',
      needsImprovement: 'Gelişim Gerekli'
    };
    return statusTexts[status as keyof typeof statusTexts] || 'Bilinmeyen';
  };

  const locationData = calculateLocationData();

  if (locationData.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lokasyon Bazlı Analiz</h3>
            <MapPin className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lokasyon bazlı analiz için enerji verisi mevcut değil
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lokasyon Bazlı Analiz</h3>
          <MapPin className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {locationData.map((item, index) => {
            const FacilityIcon = getFacilityIcon(item.details.facilityType);
            
            return (
              <div key={index} className="group p-4 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    <FacilityIcon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  
                  <div className="text-lg font-light text-gray-900 dark:text-white mb-1">
                    {CarbonAnalysisService.formatCO2(item.value)}
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate" title={item.location}>
                    {item.location}
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    %{item.percentage.toFixed(1)} | {CarbonAnalysisService.formatNumber(item.details.electricity)} kWh
                  </div>
                  
                  <div className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(item.status)} mb-2`}>
                    {getStatusText(item.status)}
                  </div>
                  
                  {/* Yenilenebilir enerji oranı */}
                  <div className="text-xs text-gray-500 mb-2">
                    %{item.details.renewableRatio.toFixed(1)} yenilenebilir
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-emerald-500 h-1 rounded-full transition-all duration-1000" 
                      style={{width: `${item.details.renewableRatio}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Özet bilgiler */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {locationData.length}
              </div>
              <div className="text-xs text-gray-500">Aktif Tesis</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {CarbonAnalysisService.formatNumber(
                  locationData.reduce((sum, item) => sum + item.details.electricity, 0)
                )} kWh
              </div>
              <div className="text-xs text-gray-500">Toplam Enerji</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {(locationData.reduce((sum, item) => sum + item.details.renewableRatio, 0) / locationData.length).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Ort. Yenilenebilir</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {CarbonAnalysisService.formatCO2(
                  locationData.reduce((sum, item) => sum + item.value, 0)
                )}
              </div>
              <div className="text-xs text-gray-500">Toplam Emisyon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}