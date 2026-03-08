// components/BenchmarkPerformance.tsx - English version
'use client';

import React from 'react';
import { TrendingUp, Award, BarChart3 } from 'lucide-react';
import { EmissionData, Company } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface BenchmarkPerformanceProps {
  t: any;
  emissions: EmissionData[];
  company: Company | null;
}

interface BenchmarkData {
  sectorAverage: number;
  bestPerformance: number;
  yourPerformance: number;
  ranking: number;
  totalCompanies: number;
  performanceScore: number;
  sector?: string;
  employeeIntensity?: number;
  revenueIntensity?: number;
}

export default function BenchmarkPerformance({ t, emissions, company }: BenchmarkPerformanceProps) {
  const currentEmission = emissions[0];

  // Calculate benchmark data with real values
  const calculateBenchmarkData = (): BenchmarkData => {
    if (!currentEmission || !company) {
      return {
        sectorAverage: 0,
        bestPerformance: 0,
        yourPerformance: 0,
        ranking: 0,
        totalCompanies: 0,
        performanceScore: 0
      };
    }

    const yourEmissions = CarbonAnalysisService.calculateTotalEmissions(currentEmission);
    const yourEmissionsInTons = yourEmissions / 1000;

    // Sector-based benchmark values (will come from API in real application)
    const sectorBenchmarks = getSectorBenchmarks(company.industry_sector);
    
    // Performance score calculation (0-100)
    const performanceScore = calculatePerformanceScore(yourEmissionsInTons, sectorBenchmarks);
    
    // Ranking calculation (based on sector average)
    const ranking = calculateRanking(yourEmissionsInTons, sectorBenchmarks);

    return {
      sectorAverage: sectorBenchmarks.average,
      bestPerformance: sectorBenchmarks.best,
      yourPerformance: yourEmissionsInTons,
      ranking: ranking.position,
      totalCompanies: ranking.total,
      performanceScore,
      sector: company.industry_sector || 'General',
      employeeIntensity: company.employee_count ? yourEmissionsInTons / company.employee_count * 1000 : 0,
      revenueIntensity: company.annual_revenue ? yourEmissionsInTons / (company.annual_revenue / 1000000) : 0
    };
  };

  const getSectorBenchmarks = (sector: string | null) => {
    // Sector-based benchmark data (sample)
    const benchmarks: { [key: string]: { average: number; best: number; worst: number } } = {
      'Manufacturing': { average: 4235, best: 2145, worst: 8500 },
      'İmalat': { average: 4235, best: 2145, worst: 8500 },
      'Technology': { average: 1850, best: 890, worst: 3200 },
      'Teknoloji': { average: 1850, best: 890, worst: 3200 },
      'Energy': { average: 6800, best: 3400, worst: 12000 },
      'Enerji': { average: 6800, best: 3400, worst: 12000 },
      'Retail': { average: 2100, best: 1200, worst: 4000 },
      'Perakende': { average: 2100, best: 1200, worst: 4000 },
      'Finance': { average: 1200, best: 650, worst: 2500 },
      'Finans': { average: 1200, best: 650, worst: 2500 }
    };

    return benchmarks[sector || 'Manufacturing'] || benchmarks['Manufacturing'];
  };

  const calculatePerformanceScore = (yourEmissions: number, benchmarks: any): number => {
    if (yourEmissions <= benchmarks.best) return 100;
    if (yourEmissions >= benchmarks.worst) return 0;
    
    const range = benchmarks.worst - benchmarks.best;
    const position = benchmarks.worst - yourEmissions;
    return Math.round((position / range) * 100);
  };

  const calculateRanking = (yourEmissions: number, benchmarks: any) => {
    // Number of companies in sector and ranking (sample calculation)
    const totalCompanies = 147; // Will come from API in real application
    
    let position;
    if (yourEmissions <= benchmarks.best) {
      position = Math.floor(Math.random() * 10) + 1; // Top 10
    } else if (yourEmissions <= benchmarks.average) {
      position = Math.floor(Math.random() * 50) + 11; // Between 11-60
    } else {
      position = Math.floor(Math.random() * 87) + 61; // Between 61-147
    }

    return { position, total: totalCompanies };
  };

  const getPerformanceLevel = (score: number): { level: string; color: string; icon: any } => {
    if (score >= 90) return { level: 'Excellent', color: 'text-emerald-600', icon: Award };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', icon: TrendingUp };
    if (score >= 50) return { level: 'Average', color: 'text-yellow-600', icon: BarChart3 };
    return { level: 'Needs Improvement', color: 'text-red-600', icon: BarChart3 };
  };

  const benchmarkData = calculateBenchmarkData();
  const performanceLevel = getPerformanceLevel(benchmarkData.performanceScore);
  const PerformanceIcon = performanceLevel.icon;

  const comparisonData = [
    { label: 'Industry Average', value: `${benchmarkData.sectorAverage.toLocaleString()} tCO2`, color: 'text-gray-500 dark:text-gray-400' },
    { label: 'Best Performance', value: `${benchmarkData.bestPerformance.toLocaleString()} tCO2`, color: 'text-emerald-600' },
    { label: 'Your Performance', value: `${benchmarkData.yourPerformance.toLocaleString()} tCO2`, color: 'text-gray-900 dark:text-white font-medium' }
  ];

  if (benchmarkData.yourPerformance === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Industry Benchmark</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Insufficient data available for benchmarking
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Industry Benchmark</h3>
          <PerformanceIcon className={`w-5 h-5 ${performanceLevel.color}`} />
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Main performance indicator */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-sm">
          <div className="text-2xl font-light text-emerald-600 mb-1">
            Ranked #{benchmarkData.ranking}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Performance within {benchmarkData.sector || 'General'} sector
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
            Out of {benchmarkData.totalCompanies} companies
          </div>
          
          {/* Performance score */}
          <div className="flex items-center justify-center gap-2">
            <span className={`text-sm font-medium ${performanceLevel.color}`}>
              {performanceLevel.level}
            </span>
            <span className="text-xs text-gray-500">
              ({benchmarkData.performanceScore}/100)
            </span>
          </div>
        </div>
        
        {/* Comparison data */}
        <div className="space-y-3">
          {comparisonData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className={`text-sm ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Intensity metrics */}
        {((benchmarkData.employeeIntensity && benchmarkData.employeeIntensity > 0) || 
          (benchmarkData.revenueIntensity && benchmarkData.revenueIntensity > 0)) && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 mb-2">Intensity Metrics</div>
            <div className="space-y-2">
              {benchmarkData.employeeIntensity && benchmarkData.employeeIntensity > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Per employee</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {benchmarkData.employeeIntensity.toFixed(2)} kg/employee
                  </span>
                </div>
              )}
              {benchmarkData.revenueIntensity && benchmarkData.revenueIntensity > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Per revenue</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {benchmarkData.revenueIntensity.toFixed(2)} tCO2/M$
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Best</span>
            <span>Industry Avg.</span>
            <span>Worst</span>
          </div>
          <div className="relative w-full bg-red-100 dark:bg-red-900/20 rounded-full h-2">
            <div className="absolute bg-yellow-500 h-2 rounded-full" style={{
              left: '40%',
              width: '20%'
            }}></div>
            <div className="absolute bg-emerald-500 h-2 rounded-full" style={{
              left: '0%',
              width: '30%'
            }}></div>
            <div 
              className="absolute w-1 h-4 bg-gray-900 dark:bg-white rounded-sm transform -translate-y-1" 
              style={{
                left: `${(benchmarkData.performanceScore)}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}