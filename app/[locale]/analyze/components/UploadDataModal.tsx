// components/UploadDataModal.tsx
import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUploaded: (data: any[]) => void;
}

export default function UploadDataModal({ isOpen, onClose, onDataUploaded }: UploadDataModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file) return;

    setUploadStatus('processing');
    setErrorMessage('');

    // Dosya tipini kontrol et
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'csv') {
      // CSV dosyası işle
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setUploadStatus('error');
            setErrorMessage('CSV dosyası okunurken hata oluştu.');
            return;
          }
          
          processUploadedData(results.data);
        }
      });
    } else if (fileType === 'json') {
      // JSON dosyası işle
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          processUploadedData(Array.isArray(jsonData) ? jsonData : [jsonData]);
        } catch (error) {
          setUploadStatus('error');
          setErrorMessage('JSON dosyası geçersiz format.');
        }
      };
      reader.readAsText(file);
    } else {
      setUploadStatus('error');
      setErrorMessage('Desteklenen formatlar: CSV, JSON');
    }
  };

  const processUploadedData = (data: any[]) => {
    // Veriyi karbon ayak izi formatına dönüştür
    const carbonData = data.map((row, index) => ({
      id: Date.now() + index,
      date: row.date || new Date().toISOString().split('T')[0],
      emissions: parseFloat(row.emissions || row.carbon || row.co2 || 0),
      source: row.source || row.type || 'Upload',
      scope: row.scope || 'Scope 1',
      category: row.category || 'Energy',
      amount: parseFloat(row.amount || row.value || 0),
      unit: row.unit || 'tCO2'
    }));

    setUploadedData(carbonData);
    setUploadStatus('success');
  };

  const handleConfirmUpload = () => {
    onDataUploaded(uploadedData);
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Veri Yükle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-emerald-400 bg-emerald-400/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Dosya Yükle veya Sürükle
            </h3>
            <p className="text-gray-400 mb-4">
              CSV veya JSON formatında karbon emisyon verileri
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Dosya Seç
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Status Messages */}
          {uploadStatus === 'processing' && (
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                <span className="text-blue-400">Dosya işleniyor...</span>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{errorMessage}</span>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">
                    Başarıyla yüklendi: {uploadedData.length} kayıt
                  </span>
                </div>
              </div>

              {/* Data Preview */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Veri Önizleme</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left p-2">Tarih</th>
                        <th className="text-left p-2">Emisyon</th>
                        <th className="text-left p-2">Kaynak</th>
                        <th className="text-left p-2">Kapsam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="text-gray-300 border-b border-gray-800">
                          <td className="p-2">{row.date}</td>
                          <td className="p-2">{row.emissions} {row.unit}</td>
                          <td className="p-2">{row.source}</td>
                          <td className="p-2">{row.scope}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {uploadedData.length > 5 && (
                    <p className="text-gray-400 text-center mt-2">
                      +{uploadedData.length - 5} daha fazla kayıt
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Expected Format */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Beklenen Format</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>CSV Sütunları:</strong> date, emissions/carbon/co2, source/type, scope, category</p>
              <p><strong>JSON:</strong> Aynı alanları içeren obje dizisi</p>
              <p><strong>Örnek:</strong> date: "2024-01-01", emissions: 25.5, source: "Electricity"</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            İptal
          </button>
          {uploadStatus === 'success' && (
            <button
              onClick={handleConfirmUpload}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Veriyi Kaydet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}