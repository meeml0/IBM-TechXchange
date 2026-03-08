// components/LoadingSpinner.tsx - Fixed for SSR hydration
'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Veriler yükleniyor...' }: LoadingSpinnerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fixed heights for consistent SSR/client rendering
  const barHeights = [20, 25, 15, 30, 18];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Ana loading ikonu */}
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-gray-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-emerald-200 dark:border-emerald-800 rounded-sm animate-spin border-t-emerald-600 mx-auto"></div>
        </div>

        {/* Loading metni */}
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
          {message}
        </h2>
        
        {/* Alt açıklama */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Karbon ayak izi verileri analiz ediliyor ve hazırlanıyor...
        </p>

        {/* Progress steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Emisyon verileri getiriliyor</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <span>Enerji tüketimi analiz ediliyor</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <span>AI analizleri hazırlanıyor</span>
          </div>
        </div>

        {/* Animated bars - Fixed for SSR */}
        {isClient && (
          <div className="flex items-end justify-center gap-1 mt-8">
            {barHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-emerald-500 rounded-full animate-pulse"
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Static fallback for SSR */}
        {!isClient && (
          <div className="flex items-end justify-center gap-1 mt-8">
            {barHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 h-5 bg-emerald-500 rounded-full"
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}