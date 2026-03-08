// components/ExportDataModal.tsx
import React, { useState } from 'react';
import { Download, X, FileText, Database, Calendar, FileMinus } from 'lucide-react';
import { Company, EmissionData, EnergyConsumption, Transportation, SupplyChain, AIInsight } from '../../../../types/database';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData?: Company;
  emissionsData?: EmissionData[];
  energyData?: EnergyConsumption[];
  transportationData?: Transportation[];
  supplyChainData?: SupplyChain[];
  aiInsights?: AIInsight[];
}

export default function ExportDataModal({ 
  isOpen, 
  onClose, 
  companyData, 
  emissionsData = [],
  energyData = [],
  transportationData = [],
  supplyChainData = [],
  aiInsights = []
}: ExportDataModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'excel' | 'pdf'>('csv');
  const [exportType, setExportType] = useState<'all' | 'summary' | 'detailed'>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  // Calculate totals from real data
  const calculateTotals = () => {
    console.log('[ExportModal] Calculating totals from data:', {
      emissionsLength: emissionsData?.length || 0,
      energyLength: energyData?.length || 0,
      firstEmission: emissionsData?.[0] || null
    });

    if (!emissionsData || emissionsData.length === 0) {
      console.warn('[ExportModal] No emissions data available for calculations');
      return {
        totalEmissions: 0,
        scope1Total: 0,
        scope2Total: 0,
        scope3Total: 0,
        renewablePercentage: 0,
        electricityConsumption: 0
      };
    }

    const latestEmission = emissionsData[0];
    console.log('[ExportModal] Latest emission data:', latestEmission);
    
    const scope1Total = Number(latestEmission.scope1_total_co2_kg || 0) / 1000;
    const scope2Total = Number(latestEmission.scope2_location_based || latestEmission.scope2_market_based || 0) / 1000;
    const scope3Total = Number(latestEmission.scope3_total_co2_kg || 0) / 1000;
    const totalEmissions = scope1Total + scope2Total + scope3Total;
    
    const renewablePercentage = Number(latestEmission.renewable_energy_percentage || 0);
    const electricityConsumption = Number(latestEmission.electricity_consumption_kwh || 0);
    
    const result = {
      totalEmissions: Math.round(totalEmissions * 10) / 10,
      scope1Total: Math.round(scope1Total * 10) / 10,
      scope2Total: Math.round(scope2Total * 10) / 10,
      scope3Total: Math.round(scope3Total * 10) / 10,
      renewablePercentage: Math.round(renewablePercentage * 10) / 10,
      electricityConsumption: Math.round(electricityConsumption / 1000 * 10) / 10
    };
    
    console.log('[ExportModal] Calculated totals:', result);
    return result;
  };

  const totals = calculateTotals();

  console.log('[ExportModal] Received props:', {
    companyName: companyData?.company_name,
    emissionsDataLength: emissionsData?.length || 0,
    energyDataLength: energyData?.length || 0,
    transportationDataLength: transportationData?.length || 0,
    aiInsightsLength: aiInsights?.length || 0,
    firstEmissionData: emissionsData?.[0] || null
  });

  const generateCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const generatePDFReport = (company: Company, emissions: EmissionData[], aiInsights: AIInsight[]) => {
    console.log('[ExportModal] Generating PDF with data:', {
      company: company?.company_name,
      emissionsCount: emissions?.length || 0,
      aiInsightsCount: aiInsights?.length || 0,
      firstEmission: emissions?.[0] || null
    });

    const totals = calculateTotals();
    console.log('[ExportModal] PDF totals calculated:', totals);
    
    const latestEmission = emissions?.[0];
    
    const getInsightContent = (index: number) => {
      const insight = aiInsights?.[index];
      if (!insight) {
        const defaultInsights = [
          { title: 'Energy Optimization', content: 'Energy efficiency analysis recommended.' },
          { title: 'Emission Reduction', content: 'Scope-based emission reduction strategies should be developed.' },
          { title: 'Sustainability', content: 'Increasing renewable energy usage is recommended.' }
        ];
        return defaultInsights[index] || { title: 'Analysis', content: 'Detailed analysis required.' };
      }
      return {
        title: insight.insight_title || 'AI Analysis',
        content: insight.insight_description || 'Analysis result not available.'
      };
    };

    const insight1 = getInsightContent(0);
    const insight2 = getInsightContent(1);
    const insight3 = getInsightContent(2);

    const yearOverYearChange = emissions.length > 1 
      ? (((totals.totalEmissions - ((emissions[1].scope1_total_co2_kg || 0) + (emissions[1].scope2_location_based || 0) + (emissions[1].scope3_total_co2_kg || 0)) / 1000) / totals.totalEmissions) * 100).toFixed(1)
      : '0.0';
    
    const changeSign = parseFloat(yearOverYearChange) > 0 ? '+' : '';

    console.log('[ExportModal] PDF metrics prepared:', {
      totalEmissions: totals.totalEmissions,
      scope1: totals.scope1Total,
      scope2: totals.scope2Total,
      scope3: totals.scope3Total,
      renewablePercentage: totals.renewablePercentage,
      yearOverYearChange
    });

    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>UniGreen Carbon Footprint Report</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background-color: #ffffff;
            color: #1a1a1a;
            line-height: 1.7;
            font-size: 15px;
            font-weight: 400;
        }
        
        .container {
            max-width: 720px;
            margin: 0 auto;
            padding: 60px 40px;
        }
        
        .header {
            margin-bottom: 60px;
            padding-bottom: 40px;
            border-bottom: 1px solid #e8e8e8;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .logo-icon {
            width: 24px;
            height: 24px;
            margin-right: 12px;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #22c55e, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }
        
        .title {
            font-size: 28px;
            font-weight: 300;
            color: #1a1a1a;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            color: #6a6a6a;
            font-size: 16px;
            font-weight: 300;
            margin-bottom: 30px;
        }
        
        .company-info {
            background: #fafafa;
            padding: 24px;
            border-radius: 2px;
            margin-bottom: 20px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .info-label {
            font-weight: 400;
            color: #4a4a4a;
        }
        
        .info-value {
            color: #1a1a1a;
        }
        
        .section {
            margin-bottom: 50px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 400;
            color: #1a1a1a;
            margin-bottom: 24px;
            padding-bottom: 8px;
            border-bottom: 1px solid #2d7a2d;
            letter-spacing: -0.3px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }
        
        .metric-card {
            background: #ffffff;
            border: 1px solid #e8e8e8;
            border-radius: 2px;
            padding: 24px 16px;
            text-align: center;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: 300;
            color: #1a1a1a;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
        }
        
        .metric-label {
            color: #6a6a6a;
            font-size: 13px;
            font-weight: 400;
        }
        
        .metric-change {
            font-size: 11px;
            margin-top: 6px;
            color: #2d7a2d;
        }
        
        .scope-breakdown {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .scope-card {
            background: #ffffff;
            border: 1px solid #e8e8e8;
            border-radius: 2px;
            padding: 24px 16px;
            text-align: center;
            position: relative;
        }
        
        .scope-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #2d7a2d;
        }
        
        .scope-title {
            font-weight: 400;
            margin-bottom: 8px;
            color: #4a4a4a;
            font-size: 14px;
        }
        
        .scope-value {
            font-size: 20px;
            font-weight: 300;
            margin-bottom: 6px;
            color: #1a1a1a;
            letter-spacing: -0.3px;
        }
        
        .scope-desc {
            font-size: 12px;
            color: #6a6a6a;
        }
        
        .insights-box {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 2px;
            padding: 30px;
            margin-bottom: 40px;
        }
        
        .insights-title {
            font-weight: 400;
            color: #1a1a1a;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            font-size: 16px;
        }
        
        .ai-badge {
            background: #2d7a2d;
            color: white;
            font-size: 9px;
            padding: 3px 8px;
            border-radius: 2px;
            margin-right: 12px;
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        .insight-item {
            margin-bottom: 16px;
            padding-left: 16px;
            border-left: 2px solid #2d7a2d;
            color: #1a1a1a;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .insight-item strong {
            font-weight: 400;
            color: #1a1a1a;
        }
        
        .recommendations {
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 2px;
            padding: 30px;
        }
        
        .recommendations-title {
            color: #1a1a1a;
            font-weight: 400;
            margin-bottom: 20px;
            font-size: 16px;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
            font-size: 14px;
            line-height: 1.6;
            color: #1a1a1a;
        }
        
        .recommendation-icon {
            width: 4px;
            height: 4px;
            background: #2d7a2d;
            border-radius: 50%;
            margin-right: 16px;
            margin-top: 8px;
            flex-shrink: 0;
        }
        
        .footer {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid #e8e8e8;
            color: #6a6a6a;
            font-size: 12px;
            font-weight: 300;
        }
        
        .footer-logo {
            font-weight: 700;
            background: linear-gradient(135deg, #22c55e, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 14px;
            letter-spacing: -0.3px;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#22c55e"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="#059669" fill="none"/>
                </svg>
                <div class="logo-text">UNIGREEN</div>
            </div>
            <h1 class="title">Carbon Footprint Report</h1>
            <p class="subtitle">AI-Powered Sustainability Analysis</p>
            
            <div class="company-info">
                <div class="info-row">
                    <span class="info-label">Company</span>
                    <span class="info-value">${company?.company_name || 'Company Name Not Found'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Industry</span>
                    <span class="info-value">${company?.industry_sector || 'Industry Not Specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Employees</span>
                    <span class="info-value">${company?.employee_count ? company.employee_count.toLocaleString() : 'Not Specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location</span>
                    <span class="info-value">${company?.headquarters_location || 'Not Specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Report Date</span>
                    <span class="info-value">${new Date().toLocaleDateString('en-US')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Reporting Year</span>
                    <span class="info-value">${latestEmission?.reporting_year || new Date().getFullYear()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Analysis Period</span>
                    <span class="info-value">${dateRange.start} to ${dateRange.end}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Key Metrics</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${totals.totalEmissions}</div>
                    <div class="metric-label">Total Emissions (tCO₂)</div>
                    <div class="metric-change">${changeSign}${Math.abs(parseFloat(yearOverYearChange))}% annual change</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${totals.renewablePercentage}%</div>
                    <div class="metric-label">Renewable Energy</div>
                    <div class="metric-change">Current ratio</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${(totals.electricityConsumption / 1000).toFixed(1)}</div>
                    <div class="metric-label">Electricity (MWh)</div>
                    <div class="metric-change">Annual total</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${latestEmission?.data_quality_score || 'N/A'}</div>
                    <div class="metric-label">Data Quality Score</div>
                    <div class="metric-change">Out of 100</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Emissions by Scope</h2>
            <div class="scope-breakdown">
                <div class="scope-card">
                    <div class="scope-title">Scope 1</div>
                    <div class="scope-value">${totals.scope1Total} tCO₂</div>
                    <div class="scope-desc">Direct emissions</div>
                </div>
                <div class="scope-card">
                    <div class="scope-title">Scope 2</div>
                    <div class="scope-value">${totals.scope2Total} tCO₂</div>
                    <div class="scope-desc">Energy consumption</div>
                </div>
                <div class="scope-card">
                    <div class="scope-title">Scope 3</div>
                    <div class="scope-value">${totals.scope3Total} tCO₂</div>
                    <div class="scope-desc">Other emissions</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="insights-box">
                <div class="insights-title">
                    <span class="ai-badge">AI</span>
                    Analysis Results
                </div>
                <div class="insight-item">
                    <strong>${insight1.title}</strong> ${insight1.content}
                </div>
                <div class="insight-item">
                    <strong>${insight2.title}</strong> ${insight2.content}
                </div>
                <div class="insight-item">
                    <strong>${insight3.title}</strong> ${insight3.content}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="recommendations">
                <div class="recommendations-title">Recommendations</div>
                <div class="recommendation-item">
                    <div class="recommendation-icon"></div>
                    <div>Increase renewable energy ratio to 60% to reduce Scope 2 emissions by 25%</div>
                </div>
                <div class="recommendation-item">
                    <div class="recommendation-icon"></div>
                    <div>Electrify vehicle fleet to achieve 30% reduction in Scope 1 emissions</div>
                </div>
                <div class="recommendation-item">
                    <div class="recommendation-icon"></div>
                    <div>Implement supplier carbon footprint assessment to optimize Scope 3 emissions</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-logo">UNIGREEN</div>
            <div>This report was automatically generated with AI-powered analysis • ${new Date().toLocaleDateString('en-US')}</div>
        </div>
    </div>
</body>
</html>`;

    return template;
  };

  const generatePDFFromHTML = async (htmlContent: string, filename: string) => {
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        await new Promise(resolve => {
          printWindow.onload = resolve;
          setTimeout(resolve, 1000);
        });
        
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          
          printWindow.onafterprint = () => {
            setTimeout(() => {
              printWindow.close();
            }, 500);
          };
        }, 500);
        
        return true;
      }
      
      throw new Error('Popup blocked');
      
    } catch (error) {
      console.error('PDF generation error:', error);
      
      downloadFile(htmlContent, `${filename}.html`, 'text/html');
      
      setTimeout(() => {
        const instructionModal = document.createElement('div');
        instructionModal.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 24px; border-radius: 8px; max-width: 450px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.25);">
              <div style="width: 48px; height: 48px; background: #2d7a2d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px; font-weight: 600;">PDF Report Ready!</h3>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                HTML file downloaded successfully. To save as PDF:
              </p>
              <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 20px; text-align: left;">
                <ol style="margin: 0; color: #374151; font-size: 13px; line-height: 1.6; padding-left: 18px;">
                  <li>Double-click the downloaded <strong>${filename}.html</strong> file to open</li>
                  <li>Press <kbd style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px; font-size: 11px;">Ctrl+P</kbd> (Mac: <kbd style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px; font-size: 11px;">Cmd+P</kbd>)</li>
                  <li>Select <strong>"Save as PDF"</strong> as destination</li>
                  <li>Click <strong>"Save"</strong> button</li>
                </ol>
              </div>
              <button onclick="this.parentElement.parentElement.remove()" style="background: #2d7a2d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">
                Got it, Continue
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(instructionModal);
        
        const button = instructionModal.querySelector('button');
        if (button) {
          button.addEventListener('mouseenter', () => {
            (button as HTMLElement).style.background = '#1e5e1e';
          });
          button.addEventListener('mouseleave', () => {
            (button as HTMLElement).style.background = '#2d7a2d';
          });
        }
      }, 100);
      
      return false;
    }
  };

  const generateExportData = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const totals = calculateTotals();
    const latestEmission = emissionsData?.[0];
    
    switch (exportType) {
      case 'summary':
        return [{
          company_name: companyData?.company_name || 'N/A',
          company_id: companyData?.company_id || 'N/A',
          industry_sector: companyData?.industry_sector || 'N/A',
          employee_count: companyData?.employee_count || 'N/A',
          export_date: currentDate,
          reporting_year: latestEmission?.reporting_year || new Date().getFullYear(),
          total_emissions_tco2: totals.totalEmissions,
          scope1_emissions_tco2: totals.scope1Total,
          scope2_emissions_tco2: totals.scope2Total,
          scope3_emissions_tco2: totals.scope3Total,
          renewable_energy_percentage: totals.renewablePercentage,
          electricity_consumption_kwh: totals.electricityConsumption,
          data_quality_score: latestEmission?.data_quality_score || 'N/A',
          verification_status: latestEmission?.verification_status || 'N/A'
        }];
        
      case 'detailed':
        const detailedData: Array<{
          data_type: string;
          company_id: number;
          [key: string]: any;
        }> = [];
        
        emissionsData?.forEach(emission => {
          detailedData.push({
            data_type: 'emission',
            company_id: emission.company_id,
            reporting_year: emission.reporting_year,
            reporting_period: emission.reporting_period,
            scope1_total_kg: emission.scope1_total_co2_kg,
            scope1_fuel_combustion_kg: emission.scope1_fuel_combustion,
            scope1_industrial_processes_kg: emission.scope1_industrial_processes,
            scope1_fugitive_emissions_kg: emission.scope1_fugitive_emissions,
            scope2_location_based_kg: emission.scope2_location_based,
            scope2_market_based_kg: emission.scope2_market_based,
            scope3_total_kg: emission.scope3_total_co2_kg,
            scope3_purchased_goods_kg: emission.scope3_purchased_goods,
            scope3_transportation_kg: emission.scope3_transportation,
            scope3_waste_disposal_kg: emission.scope3_waste_disposal,
            scope3_business_travel_kg: emission.scope3_business_travel,
            scope3_employee_commuting_kg: emission.scope3_employee_commuting,
            electricity_consumption_kwh: emission.electricity_consumption_kwh,
            renewable_energy_percentage: emission.renewable_energy_percentage,
            data_quality_score: emission.data_quality_score,
            verification_status: emission.verification_status
          });
        });
        
        energyData?.forEach(energy => {
          detailedData.push({
            data_type: 'energy',
            company_id: energy.company_id,
            facility_name: energy.facility_name,
            measurement_date: energy.measurement_date,
            electricity_total_kwh: energy.electricity_total_kwh,
            electricity_renewable_kwh: energy.electricity_renewable_kwh,
            electricity_grid_kwh: energy.electricity_grid_kwh,
            natural_gas_m3: energy.natural_gas_m3,
            coal_tons: energy.coal_tons,
            fuel_oil_liters: energy.fuel_oil_liters,
            solar_generation_kwh: energy.solar_generation_kwh,
            wind_generation_kwh: energy.wind_generation_kwh,
            energy_intensity_per_unit: energy.energy_intensity_per_unit
          });
        });
        
        transportationData?.forEach(transport => {
          detailedData.push({
            data_type: 'transportation',
            company_id: transport.company_id,
            measurement_date: transport.measurement_date,
            vehicle_type: transport.vehicle_type,
            fuel_type: transport.fuel_type,
            total_distance_km: transport.total_distance_km,
            fuel_consumption_liters: transport.fuel_consumption_liters,
            co2_emissions_kg: transport.co2_emissions_kg
          });
        });
        
        return detailedData;
        
      default:
        return [
          {
            data_type: 'company_info',
            company_id: companyData?.company_id || 'N/A',
            company_name: companyData?.company_name || 'N/A',
            industry_sector: companyData?.industry_sector || 'N/A',
            employee_count: companyData?.employee_count || 'N/A',
            annual_revenue: companyData?.annual_revenue || 'N/A',
            headquarters_location: companyData?.headquarters_location || 'N/A',
            created_at: companyData?.created_at || 'N/A',
            updated_at: companyData?.updated_at || 'N/A'
          },
          {
            data_type: 'emissions_summary',
            total_emissions_tco2: totals.totalEmissions,
            scope1_tco2: totals.scope1Total,
            scope2_tco2: totals.scope2Total,
            scope3_tco2: totals.scope3Total,
            renewable_energy_percentage: totals.renewablePercentage,
            electricity_consumption_kwh: totals.electricityConsumption,
            data_quality_score: latestEmission?.data_quality_score || 'N/A',
            verification_status: latestEmission?.verification_status || 'N/A'
          },
          {
            data_type: 'ai_insights_summary',
            total_insights: aiInsights?.length || 0,
            high_confidence_insights: aiInsights?.filter(insight => (insight.confidence_score || 0) > 0.8).length || 0,
            total_potential_reduction_kg: aiInsights?.reduce((sum, insight) => sum + (insight.potential_co2_reduction_kg || 0), 0) || 0,
            total_estimated_savings: aiInsights?.reduce((sum, insight) => sum + (insight.estimated_cost_savings || 0), 0) || 0
          }
        ];
    }
  };

  const handleExport = async () => {
    console.log('[ExportModal] Starting export process:', {
      format: exportFormat,
      type: exportType,
      company: companyData?.company_name,
      dataAvailable: {
        emissions: emissionsData?.length || 0,
        energy: energyData?.length || 0,
        transportation: transportationData?.length || 0,
        supplyChain: supplyChainData?.length || 0,
        aiInsights: aiInsights?.length || 0
      }
    });

    const filename = `carbon_footprint_${companyData?.company_name?.replace(/\s+/g, '_') || 'company'}_${dateRange.end}`;
    
    switch (exportFormat) {
      case 'csv':
        const data = generateExportData();
        const csvContent = generateCSV(data);
        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
        break;
        
      case 'json':
        const jsonData = generateExportData();
        const jsonContent = JSON.stringify(jsonData, null, 2);
        downloadFile(jsonContent, `${filename}.json`, 'application/json');
        break;
        
      case 'excel':
        const excelData = generateExportData();
        const excelContent = generateCSV(excelData);
        downloadFile(excelContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;
        
      case 'pdf':
        if (!companyData) {
          alert('Company data not found. Cannot generate PDF report.');
          return;
        }
        
        console.log('[ExportModal] Generating PDF with company:', companyData.company_name);
        console.log('[ExportModal] Using emissions data:', emissionsData?.length || 0, 'records');
        
        const pdfContent = generatePDFReport(companyData, emissionsData || [], aiInsights || []);
        await generatePDFFromHTML(pdfContent, filename);
        break;
    }
    
    onClose();
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Export Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'csv', label: 'CSV', icon: FileText },
                { value: 'json', label: 'JSON', icon: Database },
                { value: 'excel', label: 'Excel', icon: FileText },
                { value: 'pdf', label: 'PDF Report', icon: FileMinus }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setExportFormat(value as any)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    exportFormat === value
                      ? 'border-emerald-600 bg-emerald-600/10 text-emerald-400'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {exportFormat !== 'pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Data Type
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Data', desc: 'Company info + emission data' },
                  { value: 'summary', label: 'Summary Report', desc: 'Key metrics and targets' },
                  { value: 'detailed', label: 'Detailed Data', desc: 'Category-based emission details' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setExportType(value as any)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      exportType === value
                        ? 'border-emerald-600 bg-emerald-600/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-medium ${
                      exportType === value ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {label}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {exportFormat === 'pdf' && (
            <div className="bg-emerald-600/10 border border-emerald-600/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileMinus className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">PDF Report Features</span>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Company information and key metrics</li>
                <li>• Scope-based emission breakdown</li>
                <li>• AI-powered analysis results</li>
                <li>• Optimization recommendations</li>
                <li>• Modern and printable design</li>
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Start</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">End</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            {exportFormat === 'pdf' ? 'Download Report' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}