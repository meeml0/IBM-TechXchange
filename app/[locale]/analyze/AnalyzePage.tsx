// app/[locale]/analyze/AnalyzePage.tsx - Complete with Watson AI integration
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, Settings } from 'lucide-react';
import { useCarbonData } from '../../../hooks/useCarbonData';
import Header from './components/Header';
import KPICards from './components/KPICards';
import ScopeEmissions from './components/ScopeEmissions';
import SectorAnalysis from './components/SectorAnalysis';
import TrendForecasting from './components/TrendForecasting';
import LocationAnalysis from './components/LocationAnalysis';
import AIInsights from './components/AIInsights';
import ComplianceStatus from './components/ComplianceStatus';
import BenchmarkPerformance from './components/BenchmarkPerformance';
import QuickActions from './components/QuickActions';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

interface AnalyzePageProps {
  locale?: string;
}

interface FilterOptions {
  sector?: string;
  employeeRange?: string;
  revenueRange?: string;
  location?: string;
  dataQuality?: string;
}

// Complete English translations object
const translations = {
  en: {
    title: 'Carbon Footprint Analysis Center',
    subtitle: 'Measure, analyze and develop sustainable strategies for your company\'s carbon performance with advanced AI algorithms',
    uploadData: 'Upload Data',
    startAnalysis: 'Start Detailed Analysis',
    downloadReport: 'Download Report',
    refreshData: 'Refresh Data',
    exportData: 'Export Data',
    configure: 'Settings',
    search: 'Search...',
    filter: 'Filter',
    overview: 'Overview',
    analysisResults: 'Analysis Results',
    recommendations: 'Recommendations',
    trends: 'Trend Analysis',
    forecast: 'Forecasts',
    benchmark: 'Benchmarking',
    compliance: 'Compliance',
    realtime: 'Real-time',
    loading: 'Loading data...',
    error: 'Error occurred',
    noData: 'No data found',
    noCompanySelected: 'Please select a company',
    selectCompanyMessage: 'To start carbon footprint analysis, please select a company from the dropdown above.',
    searchNoResults: 'No results found for your search',
    searchResultsMessage: 'Try adjusting your search terms or filters',
    filterNoResults: 'No companies match the selected filters',
    filterResultsMessage: 'Try adjusting your filter criteria',
    sectors: {
      energy: 'Energy Consumption',
      transport: 'Transportation & Logistics',
      production: 'Production Processes',
      office: 'Office Operations',
      waste: 'Waste Management',
      supply: 'Supply Chain'
    },
    metrics: {
      totalEmissions: 'Total Carbon Emissions',
      monthlyChange: 'Annual Change Rate',
      renewableRatio: 'Renewable Energy Ratio',
      target: 'Net Zero Target Progress',
      efficiency: 'Carbon Efficiency Index',
      intensity: 'Emission Intensity',
      reduction: 'Cumulative Reduction',
      scope1: 'Scope 1 Emissions',
      scope2: 'Scope 2 Emissions',
      scope3: 'Scope 3 Emissions',
      monthlyUnit: 'tCO2e / year',
      monthlyDifference: 'change from last year',
      efficiencyIncrease: 'efficiency increase',
      netZeroTarget: 'to 2025 Net Zero target'
    },
    scope: {
      directEmissions: 'Direct emissions',
      energyConsumption: 'Energy consumption',
      otherEmissions: 'Other emissions',
      fuelConsumption: 'Fuel combustion',
      processEmissions: 'Industrial processes',
      electricity: 'Electricity consumption',
      renewableRatio: 'Renewable energy ratio',
      steamCooling: 'Steam/Cooling',
      supplyChain: 'Purchased goods/services',
      businessTravel: 'Business travel',
      dataQuality: 'Data Quality'
    },
    insights: {
      title: 'Advanced Analysis Results',
      optimization: 'Optimization Recommendations',
      riskAssessment: 'Risk Assessment',
      compliance: 'Compliance Analysis',
      highImpact: 'High Impact',
      mediumImpact: 'Medium Impact',
      critical: 'Critical',
      longTerm: 'Long Term',
      immediate: 'Immediate',
      timeframe36: '3-6 months',
      timeframe24: '2-4 months',
      timeframe1218: '12-18 months',
      timeframe13: '1-3 months'
    },
    status: {
      excellent: 'Excellent Performance',
      good: 'Good Status',
      moderate: 'Moderate Level',
      needsImprovement: 'Needs Improvement',
      critical: 'Critical Status',
      analyzing: 'Analyzing...',
      processing: 'Processing Data...'
    },
    timeframes: {
      realtime: 'Real-time',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    },
    locations: {
      headquarters: 'Headquarters',
      production: 'Production Facilities',
      offices: 'Branch Offices',
      warehouses: 'Warehouses',
      retail: 'Retail Locations'
    },
    lastUpdate: 'Last update: 2 min ago',
    detailedSectorAnalysis: 'Detailed Sector Analysis',
    last12Months: 'Last 12 months',
    locationBasedAnalysis: 'Location-based Analysis',
    sectorRanking: 'Sector Benchmarking',
    sectorRank: '18th Position',
    sectorPerformance: 'Sector performance',
    amongCompanies: 'among 147 companies',
    sectorAverage: 'Sector Average',
    bestPerformance: 'Best Performance',
    yourPerformance: 'Your Performance',
    quickActions: 'Quick Actions',
    newDataUpload: 'Upload New Data',
    csvExcelApi: 'CSV, Excel, API',
    realTimeSync: 'Real-time sync',
    complianceReport: 'Compliance Report',
    standardReports: 'Standard reports',
    teamShare: 'Team Share',
    permissionAccess: 'Permission & access',
    autoAnalysis: 'Auto Analysis',
    scheduleSettings: 'Schedule settings',
    pdfExcelFormat: 'PDF/Excel format',
    complianceStatus: 'Compliance Status',
    compliant: 'Compliant',
    partial: 'Partial',
    review: 'Review'
  }
} as const;

export default function AnalyzePage({ locale = 'en' }: AnalyzePageProps) {
  // Default to English
  const t = translations.en;
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(1); // Default to first company
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [hasSearchOrFilter, setHasSearchOrFilter] = useState(false);

  // Use the selected company ID for data fetching with Watson AI integration
  const { 
    company, 
    emissions, 
    energy, 
    transportation, 
    supplyChain, 
    aiInsights, 
    loading, 
    error, 
    refetch, 
    generateAIInsights,
    loadingStates,
    areInsightsStale,
    dataStats
  } = useCarbonData(selectedCompanyId);

  // Handle company selection change
  const handleCompanyChange = useCallback((companyId: number) => {
    console.log(`[AnalyzePage] Company changed to: ${companyId}`);
    setSelectedCompanyId(companyId);
    // Reset search and filters when company changes
    setSearchTerm('');
    setFilters({});
    setHasSearchOrFilter(false);
  }, []);

  // Handle search changes
  const handleSearchChange = useCallback((searchTerm: string) => {
    console.log(`[AnalyzePage] Search changed to: "${searchTerm}"`);
    setSearchTerm(searchTerm);
    setHasSearchOrFilter(searchTerm.length > 0 || Object.keys(filters).length > 0);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    console.log(`[AnalyzePage] Filters changed:`, newFilters);
    setFilters(newFilters);
    setHasSearchOrFilter(searchTerm.length > 0 || Object.keys(newFilters).length > 0);
  }, [searchTerm]);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 4000);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Watson AI insights handler
  const handleGenerateAIInsights = useCallback(async () => {
    console.log('[AnalyzePage] Watson AI insights tetiklendi');
    try {
      await generateAIInsights();
      console.log('[AnalyzePage] Watson AI insights başarıyla oluşturuldu');
    } catch (error) {
      console.error('[AnalyzePage] Watson AI insights hatası:', error);
    }
  }, [generateAIInsights]);

  // Filter data based on search and filters (for demonstration)
  const filteredData = useMemo(() => {
    // In a real application, this would filter the actual data
    // For now, we'll just show/hide sections based on search/filter state
    
    if (!hasSearchOrFilter) {
      // No filtering, show all data
      return {
        showEmissions: true,
        showEnergy: true,
        showTransportation: true,
        showSupplyChain: true,
        showAIInsights: true,
        filteredEmissions: emissions,
        filteredEnergy: energy,
        filteredTransportation: transportation,
        filteredSupplyChain: supplyChain,
        filteredAIInsights: aiInsights
      };
    }

    // Apply search and filter logic here
    let showEmissions = true;
    let showEnergy = true;
    let showTransportation = true;
    let showSupplyChain = true;
    let showAIInsights = true;

    // Example search logic
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      // Hide sections that don't match search
      if (!['emission', 'carbon', 'co2', 'scope'].some(term => term.includes(searchLower) || searchLower.includes(term))) {
        showEmissions = false;
      }
      
      if (!['energy', 'electricity', 'renewable', 'kwh'].some(term => term.includes(searchLower) || searchLower.includes(term))) {
        showEnergy = false;
      }
      
      if (!['transport', 'vehicle', 'fuel', 'travel'].some(term => term.includes(searchLower) || searchLower.includes(term))) {
        showTransportation = false;
      }
      
      if (!['supply', 'supplier', 'chain', 'vendor'].some(term => term.includes(searchLower) || searchLower.includes(term))) {
        showSupplyChain = false;
      }
      
      if (!['ai', 'insight', 'analysis', 'recommendation', 'watson'].some(term => term.includes(searchLower) || searchLower.includes(term))) {
        showAIInsights = false;
      }
    }

    return {
      showEmissions,
      showEnergy,
      showTransportation,
      showSupplyChain,
      showAIInsights,
      filteredEmissions: showEmissions ? emissions : [],
      filteredEnergy: showEnergy ? energy : [],
      filteredTransportation: showTransportation ? transportation : [],
      filteredSupplyChain: showSupplyChain ? supplyChain : [],
      filteredAIInsights: showAIInsights ? aiInsights : []
    };
  }, [emissions, energy, transportation, supplyChain, aiInsights, searchTerm, filters, hasSearchOrFilter]);

  // Check if any data matches current search/filter
  const hasFilteredResults = filteredData.showEmissions || filteredData.showEnergy || 
                            filteredData.showTransportation || filteredData.showSupplyChain || 
                            filteredData.showAIInsights;

  // Loading state
  if (loading) {
    return <LoadingSpinner message={t.loading} />;
  }

  // Error state - but allow showing header even with error
  if (error && !company) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <Header 
          t={t}
          company={null}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          isAnalyzing={isAnalyzing}
          handleStartAnalysis={handleStartAnalysis}
          onRefresh={handleRefresh}
          onCompanyChange={handleCompanyChange}
        />
        <div className="max-w-8xl mx-auto px-6 lg:px-6 py-6">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  // Company not selected or no data state
  if (!company) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <Header 
          t={t}
          company={null}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          isAnalyzing={isAnalyzing}
          handleStartAnalysis={handleStartAnalysis}
          onRefresh={handleRefresh}
          onCompanyChange={handleCompanyChange}
        />
        <div className="max-w-8xl mx-auto px-6 lg:px-6 py-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              {t.noCompanySelected}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t.selectCompanyMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <Header 
  t={t}
  company={company}
  selectedTimeframe={selectedTimeframe}
  setSelectedTimeframe={setSelectedTimeframe}
  isAnalyzing={isAnalyzing}
  handleStartAnalysis={handleStartAnalysis}
  onRefresh={handleRefresh}
  onCompanyChange={handleCompanyChange}
  
  // ← YENİ: Real database props
  emissions={emissions}
  energy={energy}
  transportation={transportation}
  supplyChain={supplyChain}
  aiInsights={aiInsights}
/>

      {/* Main Dashboard */}
      <div className="max-w-8xl mx-auto px-6 lg:px-6 py-6">
        {/* Show error message if partial data */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Some data may be incomplete, but available information is displayed below.
              </span>
            </div>
          </div>
        )}

        {/* Watson AI Insights Status Banner */}
        {areInsightsStale && aiInsights.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  AI analiz sonuçları 7 günden eski. Güncel öneriler için yeni analiz yapın.
                </span>
              </div>
              <button
                onClick={handleGenerateAIInsights}
                disabled={loadingStates?.aiInsights}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Şimdi Yenile
              </button>
            </div>
          </div>
        )}

        {/* Search/Filter Results Info */}
        {hasSearchOrFilter && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {hasFilteredResults 
                    ? `Showing filtered results for "${searchTerm}" and selected filters`
                    : hasSearchOrFilter 
                      ? `No results found for "${searchTerm}" and selected filters`
                      : 'Showing all available data'
                  }
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                  setHasSearchOrFilter(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {hasSearchOrFilter && !hasFilteredResults && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              {searchTerm ? t.searchNoResults : t.filterNoResults}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? t.searchResultsMessage : t.filterResultsMessage}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({});
                setHasSearchOrFilter(false);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700 transition-colors"
            >
              Show All Data
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {(!hasSearchOrFilter || hasFilteredResults) && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Primary Metrics */}
            <div className="xl:col-span-9 space-y-6">
              
              {/* Key Performance Indicators - Always show if company data exists */}
              {(!hasSearchOrFilter || filteredData.showEmissions) && (
                <KPICards t={t} emissions={filteredData.filteredEmissions} energy={filteredData.filteredEnergy} />
              )}

              {/* Scope Emissions Breakdown */}
              {(!hasSearchOrFilter || filteredData.showEmissions) && (
                <ScopeEmissions t={t} emissions={filteredData.filteredEmissions} />
              )}

              {/* Detailed Sector Analysis */}
              {(!hasSearchOrFilter || (filteredData.showEmissions || filteredData.showEnergy || filteredData.showTransportation)) && (
                <SectorAnalysis 
                  t={t} 
                  emissions={filteredData.filteredEmissions} 
                  energy={filteredData.filteredEnergy} 
                  transportation={filteredData.filteredTransportation} 
                />
              )}

              {/* Trend Analysis & Forecasting */}
              {(!hasSearchOrFilter || filteredData.showEmissions) && (
                <TrendForecasting t={t} emissions={filteredData.filteredEmissions} />
              )}

            </div>

            {/* Right Column - Advanced Insights */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* AI-Powered Analysis Results with Watson AI Integration */}
              {(!hasSearchOrFilter || filteredData.showAIInsights) && (
                <AIInsights 
                  t={t} 
                  insights={filteredData.filteredAIInsights}
                  onGenerateInsights={handleGenerateAIInsights}
                  isGenerating={loadingStates?.aiInsights || false}
                />
              )}

              {/* Compliance & Standards */}
              {(!hasSearchOrFilter || filteredData.showEmissions) && (
                <ComplianceStatus t={t} emissions={filteredData.filteredEmissions} />
              )}

              {/* Performance Benchmarking */}
              {(!hasSearchOrFilter || filteredData.showEmissions) && (
                <BenchmarkPerformance t={t} emissions={filteredData.filteredEmissions} company={company} />
              )}

            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}