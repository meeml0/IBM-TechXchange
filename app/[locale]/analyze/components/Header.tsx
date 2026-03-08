// components/Header.tsx - Real company data from database
'use client';

import React, { useState, useEffect } from 'react';
import AIAnalysisPopup from './AIAnalysisPopup';
import UploadDataModal from './UploadDataModal';
import ExportDataModal from './ExportDataModal';
import { 
  Activity, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Settings, 
  Calculator, 
  RefreshCw,
  ChevronDown,
  Building,
  CheckCircle,
  Plus,
  Sparkles
} from 'lucide-react';
import { Company, EmissionData, EnergyConsumption, Transportation, SupplyChain, AIInsight } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface HeaderProps {
  t: any;
  company: Company | null;
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
  isAnalyzing: boolean;
  handleStartAnalysis: () => void;
  onRefresh: () => void;
  onCompanyChange?: (companyId: number) => void;
  onDashboardUpdate?: (data: any) => void;
  // Real database props for export
  emissions?: EmissionData[];
  energy?: EnergyConsumption[];
  transportation?: Transportation[];
  supplyChain?: SupplyChain[];
  aiInsights?: AIInsight[];
}

export default function Header({ 
  t, 
  company,
  selectedTimeframe, 
  setSelectedTimeframe, 
  isAnalyzing, 
  handleStartAnalysis,
  onRefresh,
  onCompanyChange,
  onDashboardUpdate,
  // Real database props
  emissions = [],
  energy = [],
  transportation = [],
  supplyChain = [],
  aiInsights = []
}: HeaderProps) {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  // State'ler
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  // AI Analysis Popup state
  const [showAIPopup, setShowAIPopup] = useState(false);

  // Şirket listesini veritabanından getir
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const companies = await CarbonAnalysisService.getAllCompanies();
        setAvailableCompanies(companies);
        console.log(`[Header] ${companies.length} şirket yüklendi`);
      } catch (error) {
        console.error('[Header] Şirket listesi yüklenemedi:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Şirket bilgilerini göster
  const companyInfo = company ? {
    name: company.company_name,
    sector: company.industry_sector,
    location: company.headquarters_location,
    employeeCount: company.employee_count,
    lastUpdate: new Date(company.updated_at).toLocaleString('tr-TR')
  } : null;

  const handleCompanySelect = (companyId: number) => {
    setShowCompanyDropdown(false);
    if (onCompanyChange) {
      onCompanyChange(companyId);
    }
  };

  const getCurrentCompany = () => {
    return availableCompanies.find(c => c.company_id === company?.company_id) || availableCompanies[0];
  };

  // AI Analiz sonuçları callback
  const handleAIAnalysisComplete = (results: any[]) => {
    console.log('AI Analiz sonuçları alındı:', results);
    
    // Dashboard'ı güncelle
    if (onDashboardUpdate) {
      onDashboardUpdate({ 
        type: 'ai_results',
        aiResults: results,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Upload Data callback
  const handleDataUploaded = (uploadedData: any[]) => {
    console.log('Yeni veri yüklendi:', uploadedData);
    
    // Dashboard'ı güncelle
    if (onDashboardUpdate) {
      onDashboardUpdate({ 
        type: 'uploaded_data',
        uploadedData: uploadedData,
        timestamp: new Date().toISOString()
      });
    }
    
    setUploadedData(prev => [...prev, ...uploadedData]);
  };

  // AI Analysis başlatma fonksiyonu - companyData ile
  const handleAIAnalysis = () => {
    if (!company) {
      console.warn('Şirket seçilmemiş, AI analizi başlatılamıyor');
      return;
    }
    setShowAIPopup(true);
  };

  // Debug: Export verileri kontrol et
  useEffect(() => {
    if (company) {
      console.log('[Header] Export için mevcut veriler:', {
        company: company?.company_name,
        emissions: emissions?.length || 0,
        energy: energy?.length || 0,
        transportation: transportation?.length || 0,
        supplyChain: supplyChain?.length || 0,
        aiInsights: aiInsights?.length || 0
      });
    }
  }, [company, emissions, energy, transportation, supplyChain, aiInsights]);

  return (
    <div className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-8xl mx-auto px-12 lg:px-12 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
              <Activity className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white mb-1">
                {t.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                {t.subtitle}
              </p>
            </div>
          </div>
          
          {/* Company Selector & Status */}
          <div className="flex items-center gap-4">
            {/* Company Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-64"
                disabled={loadingCompanies}
              >
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-sm flex items-center justify-center">
                  <Building className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 text-left">
                  {loadingCompanies ? (
                    <div className="text-sm text-gray-500">Şirketler yükleniyor...</div>
                  ) : getCurrentCompany() ? (
                    <>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getCurrentCompany()?.company_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getCurrentCompany()?.industry_sector} • {getCurrentCompany()?.employee_count?.toLocaleString()} çalışan
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">Şirket bulunamadı</div>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showCompanyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-gray-600">
                      {loadingCompanies 
                        ? 'Şirketler yükleniyor...' 
                        : `Analiz Edilebilir Şirketler (${availableCompanies.length})`
                      }
                    </div>
                    
                    {loadingCompanies ? (
                      <div className="px-3 py-8 text-center">
                        <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                        <div className="text-sm text-gray-500">Veriler yükleniyor...</div>
                      </div>
                    ) : availableCompanies.length === 0 ? (
                      <div className="px-3 py-8 text-center">
                        <Building className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-500 mb-2">Henüz şirket kaydı yok</div>
                        <div className="text-xs text-gray-400">Veritabanına şirket ekleyin</div>
                      </div>
                    ) : (
                      availableCompanies.map((comp) => (
                        <button
                          key={comp.company_id}
                          onClick={() => handleCompanySelect(comp.company_id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                            comp.company_id === company?.company_id 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                            comp.company_id === company?.company_id 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                              : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            {comp.company_id === company?.company_id ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Building className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{comp.company_name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {comp.industry_sector || 'Sektör belirtilmemiş'} • {comp.headquarters_location || 'Konum belirtilmemiş'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {comp.employee_count ? `${comp.employee_count.toLocaleString()} çalışan` : 'Çalışan sayısı belirtilmemiş'}
                            </div>
                            <div className="text-xs text-emerald-600">
                              Son güncelleme: {new Date(comp.updated_at).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  
                  {/* Add new company option */}
                  <div className="border-t border-gray-100 dark:border-gray-600 p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-sm transition-colors">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-sm flex items-center justify-center">
                        <Plus className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium">Yeni Şirket Ekle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{t.realtime}</span>
            </div>
          </div>
        </div>

        {/* Company Details */}
        {companyInfo && (
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            <span className="font-medium">{companyInfo.name}</span>
            {companyInfo.sector && <span>• {companyInfo.sector}</span>}
            {companyInfo.location && <span>• {companyInfo.location}</span>}
            {companyInfo.employeeCount && (
              <span>• {companyInfo.employeeCount.toLocaleString()} çalışan</span>
            )}
            <span>• Son güncelleme: {companyInfo.lastUpdate}</span>
          </div>
        )}

        {/* Control Panel */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder={t.search}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              {t.filter}
            </button>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="realtime">{t.timeframes?.realtime || 'Anlık'}</option>
              <option value="daily">{t.timeframes?.daily || 'Günlük'}</option>
              <option value="weekly">{t.timeframes?.weekly || 'Haftalık'}</option>
              <option value="monthly">{t.timeframes?.monthly || 'Aylık'}</option>
              <option value="quarterly">{t.timeframes?.quarterly || 'Çeyreklik'}</option>
              <option value="yearly">{t.timeframes?.yearly || 'Yıllık'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              title="Verileri Yenile"
            >
              <RefreshCw className="w-4 h-4" />
              {t.refreshData || 'Yenile'}
            </button>
            
            {/* Upload Data butonu */}
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors text-sm"
              title="Karbon emisyon verilerini yükle"
            >
              <Upload className="w-4 h-4" />
              {t.uploadData}
            </button>
            
            {/* Export Data butonu - Improved with data check */}
            <button 
              onClick={() => setShowExportModal(true)}
              disabled={!company}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title={company ? `${company.company_name} verilerini dışa aktar` : "Önce bir şirket seçin"}
            >
              <Download className="w-4 h-4" />
              {t.exportData}
              {company && (emissions?.length || 0) > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-purple-500 text-xs rounded-full">
                  {(emissions?.length || 0) + (energy?.length || 0) + (transportation?.length || 0)}
                </span>
              )}
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              <Settings className="w-4 h-4" />
              {t.configure}
            </button>
            
            {/* AI Analysis Button */}
            <button 
              onClick={handleAIAnalysis}
              disabled={!company}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-sm hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm border border-emerald-600 relative overflow-hidden group"
              title={company ? "Dinamik AI Analizi Başlat" : "Önce bir şirket seçin"}
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Dinamik AI Analizi</span>
              {company && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            
            <button 
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              {isAnalyzing ? (t.status?.analyzing || 'Analiz Ediliyor...') : t.startAnalysis}
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Popup */}
      <AIAnalysisPopup 
        isOpen={showAIPopup} 
        onClose={() => setShowAIPopup(false)} 
        companyId={company?.company_id || 1}
        companyData={company ? {
          name: company.company_name,
          industry: company.industry_sector || 'Belirtilmemiş',
          size: company.employee_count ? 
            (company.employee_count < 50 ? 'Küçük' : 
             company.employee_count < 250 ? 'Orta' : 'Büyük') : 'Belirtilmemiş',
          location: company.headquarters_location || 'Belirtilmemiş'
        } : undefined}
        onAnalysisComplete={handleAIAnalysisComplete}
      />

      {/* Upload Data Modal */}
      <UploadDataModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onDataUploaded={handleDataUploaded}
      />

      {/* Export Data Modal - WITH REAL DATABASE PROPS */}
      <ExportDataModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        companyData={company || undefined}
        emissionsData={emissions}
        energyData={energy}
        transportationData={transportation}
        supplyChainData={supplyChain}
        aiInsights={aiInsights}
      />

      {/* Close dropdown when clicking outside */}
      {showCompanyDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCompanyDropdown(false)}
        />
      )}
    </div>
  );
}