'use client';

import React from 'react';
import { Activity, ChevronRight, Brain, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { AIInsight } from '../../../../types/database';
import { CarbonAnalysisService } from '../../../../services/carbonAnalysisService';

interface AIInsightsProps {
  t: any;
  insights?: AIInsight[];
  onGenerateInsights?: () => void;
  isGenerating?: boolean;
}

export default function AIInsights({ t, insights = [], onGenerateInsights, isGenerating = false }: AIInsightsProps) {
  const displayInsights = insights.length > 0 ? insights.slice(0, 5) : [];

  const getPriorityFromComplexity = (complexity: string | null): string => {
    switch (complexity?.toLowerCase()) {
      case 'low':
      case 'düşük':
        return 'high';
      case 'medium':
      case 'orta':
        return 'medium';
      case 'high':
      case 'yüksek':
        return 'critical';
      default:
        return 'medium';
    }
  };

  const getTimeframeFromComplexity = (complexity: string | null): string => {
    switch (complexity?.toLowerCase()) {
      case 'low':
      case 'düşük':
        return '1-3 months';
      case 'medium':
      case 'orta':
        return '3-6 months';
      case 'high':
      case 'yüksek':
        return '6-12 months';
      default:
        return '3-6 months';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          border: 'border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600',
          dot: 'bg-red-500',
          badge: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        };
      case 'high':
        return {
          border: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
        };
      case 'medium':
        return {
          border: 'border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-600',
          dot: 'bg-yellow-500',
          badge: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
        };
      default:
        return {
          border: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
          dot: 'bg-gray-400',
          badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        };
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High Impact';
      case 'medium':
        return 'Medium Impact';
      default:
        return 'Low Impact';
    }
  };

  const getInsightTypeIcon = (insightType: string | null) => {
    if (insightType?.includes('Watson AI')) {
      return <Zap className="w-3 h-3 text-blue-500" />;
    }
    return <Activity className="w-3 h-3 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Minimalist No data state
  if (displayInsights.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center">
                <Brain className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Analysis Results</h3>
            </div>
            {onGenerateInsights && (
              <button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all duration-200 flex items-center gap-2 ${
                  isGenerating
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3" />
                    New Analysis
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="p-12">
          <div className="text-center max-w-md mx-auto">
            {/* Simple Icon */}
            <div className="w-16 h-16 mx-auto mb-8 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            
            {/* Title */}
            <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              No AI Analysis Available
            </h4>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Generate personalized carbon reduction recommendations and cost-saving strategies using Watson AI analysis.
            </p>
            
            {/* Simple Stats */}
            <div className="flex justify-center gap-8 mb-8 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-white">Smart</div>
                <div className="text-gray-500">Recommendations</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-white">AI</div>
                <div className="text-gray-500">Powered</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-white">ROI</div>
                <div className="text-gray-500">Focused</div>
              </div>
            </div>

            {/* CTA Button */}
            {onGenerateInsights && (
              <button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className={`px-8 py-3 text-sm font-medium rounded-sm transition-all duration-200 flex items-center gap-3 mx-auto ${
                  isGenerating
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Watson AI Working...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Start Watson AI Analysis
                  </>
                )}
              </button>
            )}
            
            {/* Footer Note */}
            <p className="text-xs text-gray-400 mt-6">
              Analysis typically takes 30 seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main content with insights (unchanged)
  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-sm flex items-center justify-center">
              <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Analysis Results</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {displayInsights.length} recommendations • Last updated: {formatDate(displayInsights[0]?.analysis_date || new Date().toISOString())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onGenerateInsights && (
              <button
                onClick={onGenerateInsights}
                disabled={isGenerating}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 flex items-center gap-2 ${
                  isGenerating
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Watson AI Working...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Watson AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {displayInsights.map((insight, index) => {
          const priority = getPriorityFromComplexity(insight.implementation_complexity);
          const styles = getPriorityStyles(priority);
          const timeframe = getTimeframeFromComplexity(insight.implementation_complexity);

          return (
            <div 
              key={insight.insight_id} 
              className={`group p-4 border rounded-sm transition-all duration-300 cursor-pointer hover:shadow-sm ${styles.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${styles.dot}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {insight.insight_title || 'No title specified'}
                      </h4>
                      {getInsightTypeIcon(insight.insight_type)}
                    </div>
                    {insight.confidence_score && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {Math.round(insight.confidence_score)}% confidence
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed line-clamp-3">
                    {insight.insight_description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-sm font-medium ${styles.badge}`}>
                        {getPriorityLabel(priority)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{timeframe}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {insight.potential_co2_reduction_kg && insight.potential_co2_reduction_kg > 0 && (
                        <div className="text-right">
                          <div className="text-xs font-medium text-emerald-600">
                            {CarbonAnalysisService.formatCO2(insight.potential_co2_reduction_kg)}
                          </div>
                          <div className="text-xs text-gray-400">CO₂ savings</div>
                        </div>
                      )}
                      {insight.estimated_cost_savings && insight.estimated_cost_savings > 0 && (
                        <div className="text-right">
                          <div className="text-xs font-medium text-blue-600">
                            ${CarbonAnalysisService.formatNumber(insight.estimated_cost_savings)}
                          </div>
                          <div className="text-xs text-gray-400">annual savings</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
              </div>
            </div>
          );
        })}
        
        {/* Summary Statistics */}
        {displayInsights.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-medium text-emerald-600">
                  {CarbonAnalysisService.formatCO2(
                    displayInsights.reduce((sum, insight) => sum + (insight.potential_co2_reduction_kg || 0), 0)
                  )}
                </div>
                <div className="text-xs text-gray-500">Total CO₂ Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-blue-600">
                  ${CarbonAnalysisService.formatNumber(
                    displayInsights.reduce((sum, insight) => sum + (insight.estimated_cost_savings || 0), 0)
                  )}
                </div>
                <div className="text-xs text-gray-500">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {Math.round(
                    displayInsights.reduce((sum, insight) => sum + (insight.confidence_score || 0), 0) / displayInsights.length
                  )}%
                </div>
                <div className="text-xs text-gray-500">Average Confidence</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}