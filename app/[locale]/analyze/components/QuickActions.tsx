// components/QuickActions.tsx - Revize edilmiş versiyon
'use client';

import React from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  FileText, 
  Users, 
  Timer, 
  ChevronRight,
  Database,
  Settings,
  Share2
} from 'lucide-react';

interface QuickActionsProps {
  t: any;
  onRefresh: () => void;
}

export default function QuickActions({ t, onRefresh }: QuickActionsProps) {
  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'refresh':
        onRefresh();
        break;
      case 'download':
        // Rapor indirme işlemi
        console.log('Rapor indiriliyor...');
        break;
      case 'upload':
        // Veri yükleme işlemi
        console.log('Veri yükleme modalı açılıyor...');
        break;
      case 'compliance':
        // Uyumluluk raporu
        console.log('Uyumluluk raporu hazırlanıyor...');
        break;
      case 'share':
        // Takım paylaşımı
        console.log('Paylaşım paneli açılıyor...');
        break;
      case 'schedule':
        // Otomatik analiz ayarları
        console.log('Zamanlama ayarları açılıyor...');
        break;
      default:
        console.log('Bilinmeyen aksiyon:', actionType);
    }
  };

  const actionItems = [
    { 
      id: 'download',
      icon: Download, 
      text: t.downloadReport || 'Rapor İndir', 
      desc: t.pdfExcelFormat || 'PDF/Excel formatında',
      action: () => handleAction('download')
    },
    { 
      id: 'upload',
      icon: Upload, 
      text: t.newDataUpload || 'Yeni Veri Yükle', 
      desc: t.csvExcelApi || 'CSV, Excel, API',
      action: () => handleAction('upload')
    },
    { 
      id: 'refresh',
      icon: RefreshCw, 
      text: t.refreshData || 'Verileri Yenile', 
      desc: t.realTimeSync || 'Gerçek zamanlı sync',
      action: () => handleAction('refresh')
    },
    { 
      id: 'compliance',
      icon: FileText, 
      text: t.complianceReport || 'Uyumluluk Raporu', 
      desc: t.standardReports || 'Standart raporlar',
      action: () => handleAction('compliance')
    },
    { 
      id: 'share',
      icon: Share2, 
      text: t.teamShare || 'Ekip Paylaş', 
      desc: t.permissionAccess || 'Yetki ve erişim',
      action: () => handleAction('share')
    },
    { 
      id: 'schedule',
      icon: Timer, 
      text: t.autoAnalysis || 'Otomatik Analiz', 
      desc: t.scheduleSettings || 'Zamanlama ayarla',
      action: () => handleAction('schedule')
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t.quickActions || 'Hızlı İşlemler'}
          </h3>
        </div>
      </div>
      
      <div className="p-6 space-y-3">
        {actionItems.map((item) => (
          <button 
            key={item.id} 
            onClick={item.action}
            className="group w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
              <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {item.text}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.desc}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        ))}
      </div>

      {/* Ek bilgi paneli */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Database className="w-3 h-3" />
          <span>Son veri güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
}