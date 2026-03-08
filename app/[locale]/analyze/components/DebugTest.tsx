// components/DebugTest.tsx - Veritabanı bağlantısını test etmek için
'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Database } from 'lucide-react';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

export default function DebugTest() {
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [configCheck, setConfigCheck] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    
    try {
      // 1. Config kontrolü
      console.log('=== CONFIG KONTROL ===');
      const config = CarbonAnalysisService.checkSupabaseConfig();
      setConfigCheck(config);
      
      // 2. Bağlantı testi
      console.log('=== BAĞLANTI TESTİ ===');
      const connection = await CarbonAnalysisService.testConnection();
      setConnectionTest(connection);
      
      // 3. Şirket listesi
      if (connection.success) {
        console.log('=== ŞİRKET LİSTESİ ===');
        const companiesData = await CarbonAnalysisService.getAllCompanies();
        setCompanies(companiesData);
        
        // 4. Eğer şirket yoksa sample oluştur
        if (companiesData.length === 0) {
          console.log('=== SAMPLE ŞİRKET OLUŞTURMA ===');
          const sampleCompany = await CarbonAnalysisService.createSampleCompany();
          if (sampleCompany) {
            setCompanies([sampleCompany]);
          }
        }
      }
      
    } catch (error) {
      console.error('Test çalıştırma hatası:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Veritabanı Debug Testi
          </h2>
          <button
            onClick={runTests}
            disabled={testing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Test Ediliyor...' : 'Testleri Yenile'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Config Check */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              {configCheck?.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              Environment Variables
            </h3>
            {configCheck ? (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Durum: </span>
                  <span className={configCheck.isValid ? 'text-green-600' : 'text-red-600'}>
                    {configCheck.isValid ? 'Geçerli' : 'Eksik/Hatalı'}
                  </span>
                </div>
                {configCheck.issues.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-red-600">Sorunlar:</span>
                    <ul className="list-disc list-inside ml-4 text-red-600">
                      {configCheck.issues.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">Kontrol ediliyor...</div>
            )}
          </div>

          {/* Connection Test */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              {connectionTest?.success ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : connectionTest?.success === false ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              Veritabanı Bağlantısı
            </h3>
            {connectionTest ? (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Durum: </span>
                  <span className={connectionTest.success ? 'text-green-600' : 'text-red-600'}>
                    {connectionTest.success ? 'Başarılı' : 'Başarısız'}
                  </span>
                </div>
                {connectionTest.success && (
                  <div className="text-sm">
                    <span className="font-medium">Şirket Sayısı: </span>
                    <span className="text-blue-600">{connectionTest.tableCount}</span>
                  </div>
                )}
                {connectionTest.error && (
                  <div className="text-sm">
                    <span className="font-medium text-red-600">Hata:</span>
                    <pre className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs overflow-auto">
                      {JSON.stringify(connectionTest.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">Test ediliyor...</div>
            )}
          </div>

          {/* Companies List */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Şirket Listesi ({companies.length})
            </h3>
            {companies.length > 0 ? (
              <div className="space-y-2">
                {companies.map((company, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {company.company_name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {company.company_id} | 
                      Sektör: {company.industry_sector || 'Belirtilmemiş'} | 
                      Çalışan: {company.employee_count || 'Belirtilmemiş'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">
                {testing ? 'Şirketler yükleniyor...' : 'Hiç şirket bulunamadı'}
              </div>
            )}
          </div>

          {/* Environment Info */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Environment Bilgileri</h3>
            <div className="space-y-1 text-sm font-mono">
              <div>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</div>
              <div>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'MEVCUT' : 'YOK'}</div>
              <div>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'MEVCUT' : 'YOK'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}