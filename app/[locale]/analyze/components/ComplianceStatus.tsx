// components/ComplianceStatus.tsx - English version with rounded percentages
'use client';

import React from 'react';
import { Shield, CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';
import { EmissionData } from '../../../../types/database';

interface ComplianceStatusProps {
  t: any;
  emissions: EmissionData[];
}

// Default English translations
const defaultTranslations = {
  complianceStatus: 'Compliance Status',
  overallScore: 'Overall Score',
  dataQualityScore: 'Data Quality Score',
  verified: 'Verified',
  reportingPeriod: 'Reporting Period',
  insufficientData: 'Insufficient data for compliance assessment'
};

export default function ComplianceStatus({ t, emissions }: ComplianceStatusProps) {
  const currentEmission = emissions[0];

  // Safe translation access with fallbacks
  const translations = {
    ...defaultTranslations,
    ...t
  };

  // Real data-based compliance calculations
  const calculateComplianceScore = () => {
    if (!currentEmission) return [];

    const dataQuality = currentEmission.data_quality_score || 0;
    const isVerified = currentEmission.verification_status === 'verified' || 
                      currentEmission.verification_status === 'doğrulanmış';
    const hasAllScopes = (currentEmission.scope1_total_co2_kg || 0) > 0 && 
                        (currentEmission.scope2_location_based || 0) > 0 && 
                        (currentEmission.scope3_total_co2_kg || 0) > 0;
    const hasRenewableData = (currentEmission.renewable_energy_percentage || 0) > 0;

    return [
      {
        standard: 'ISO 14064-1',
        description: 'Greenhouse gas quantification standard',
        status: isVerified && dataQuality >= 90 ? 'compliant' : dataQuality >= 70 ? 'partial' : 'review',
        score: Math.round(Math.min(100, dataQuality + (isVerified ? 10 : 0))),
        requirements: ['Data verification', 'Quality assurance', 'Documentation']
      },
      {
        standard: 'GHG Protocol',
        description: 'Corporate accounting and reporting standard',
        status: hasAllScopes && dataQuality >= 80 ? 'compliant' : hasAllScopes ? 'partial' : 'review',
        score: Math.round(hasAllScopes ? Math.min(100, dataQuality + 15) : Math.max(50, dataQuality - 20)),
        requirements: ['Scope 1,2,3 data', 'Methodology', 'Boundaries']
      },
      {
        standard: 'SBTi Standards',
        description: 'Science-based targets initiative',
        status: hasRenewableData && dataQuality >= 70 ? 'partial' : 'review',
        score: Math.round(hasRenewableData ? Math.min(100, dataQuality + (currentEmission.renewable_energy_percentage || 0) / 2) : Math.max(40, dataQuality - 30)),
        requirements: ['Target setting', 'Renewable energy', 'Reduction plans']
      },
      {
        standard: 'TCFD Guidelines',
        description: 'Climate-related financial disclosures',
        status: isVerified ? 'partial' : 'review',
        score: Math.round(isVerified ? Math.min(90, dataQuality) : Math.max(30, dataQuality - 40)),
        requirements: ['Risk assessment', 'Scenario analysis', 'Disclosure']
      },
      {
        standard: 'EU Taxonomy',
        description: 'Sustainable activities classification',
        status: hasRenewableData && (currentEmission.renewable_energy_percentage || 0) > 20 ? 'compliant' : 'partial',
        score: Math.round(hasRenewableData ? Math.min(100, 50 + (currentEmission.renewable_energy_percentage || 0)) : Math.max(40, dataQuality - 20)),
        requirements: ['Green activities', 'Environmental criteria', 'Do no harm']
      }
    ];
  };

  const complianceData = calculateComplianceScore();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'compliant':
        return {
          dot: 'bg-emerald-500',
          text: 'text-emerald-600',
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          bar: 'bg-emerald-500',
          label: 'Compliant',
          icon: CheckCircle
        };
      case 'partial':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-600',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          bar: 'bg-yellow-500',
          label: 'Partial',
          icon: AlertCircle
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-500',
          bg: 'bg-gray-50 dark:bg-gray-700/30',
          bar: 'bg-gray-400',
          label: 'Review',
          icon: Clock
        };
    }
  };

  const getOverallComplianceScore = () => {
    if (complianceData.length === 0) return 0;
    return Math.round(complianceData.reduce((sum, item) => sum + item.score, 0) / complianceData.length);
  };

  const getOverallStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-600', icon: Award };
    if (score >= 75) return { label: 'Good', color: 'text-blue-600', icon: CheckCircle };
    if (score >= 60) return { label: 'Fair', color: 'text-yellow-600', icon: AlertCircle };
    return { label: 'Needs Work', color: 'text-red-600', icon: Clock };
  };

  const overallScore = getOverallComplianceScore();
  const overallStatus = getOverallStatus(overallScore);
  const OverallIcon = overallStatus.icon;

  if (complianceData.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{translations.complianceStatus}</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {translations.insufficientData}
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{translations.complianceStatus}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <OverallIcon className={`w-4 h-4 ${overallStatus.color}`} />
              <div className="text-lg font-medium text-gray-900 dark:text-white">{overallScore}%</div>
            </div>
            <div className={`text-xs ${overallStatus.color}`}>
              {overallStatus.label} • {translations.overallScore}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Data quality indicator */}
        {currentEmission?.data_quality_score && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-sm mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{translations.dataQualityScore}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Math.round(currentEmission.data_quality_score)}%
                </span>
                {currentEmission.verification_status && (
                  <span className={`text-xs px-2 py-1 rounded-sm ${
                    currentEmission.verification_status === 'verified' || currentEmission.verification_status === 'doğrulanmış'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {currentEmission.verification_status === 'verified' || currentEmission.verification_status === 'doğrulanmış' 
                      ? translations.verified 
                      : currentEmission.verification_status}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {complianceData.map((item, index) => {
          const styles = getStatusStyles(item.status);
          const StatusIcon = styles.icon;
          
          return (
            <div key={index} className={`group p-4 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 ${styles.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${styles.dot} mt-2`}></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className={`w-4 h-4 ${styles.text}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.standard}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-sm text-gray-600 dark:text-gray-400">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">{item.score}%</div>
                    <div className={`text-xs ${styles.text} font-medium`}>
                      {styles.label}
                    </div>
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${styles.bar} transition-all duration-1000`} 
                      style={{width: `${item.score}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Reporting period info */}
        {currentEmission?.reporting_period && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {translations.reportingPeriod}: {currentEmission.reporting_period} ({currentEmission.reporting_year})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}