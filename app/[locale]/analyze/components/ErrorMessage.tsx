
// components/ErrorMessage.tsx
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  errorCode?: string;
}

export default function ErrorMessage({ 
  message = 'Veriler yüklenirken bir hata oluştu', 
  onRetry,
  showHomeButton = false,
  errorCode 
}: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Error icon */}
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-sm flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Error title */}
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
          Bir Hata Oluştu
        </h2>
        
        {/* Error message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Error code */}
        {errorCode && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-sm border">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Hata Kodu: {errorCode}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar Dene
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
          )}
        </div>

        {/* Help section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Yardıma mı ihtiyacınız var?</span>
          </div>
          <div className="space-y-2 text-xs text-gray-400 dark:text-gray-500">
            <p>• Sayfayı yenilemeyi deneyin</p>
            <p>• İnternet bağlantınızı kontrol edin</p>
            <p>• Sorun devam ederse destek ekibiyle iletişime geçin</p>
          </div>
        </div>
      </div>
    </div>
  );
}