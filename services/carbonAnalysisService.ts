// services/carbonAnalysisService.ts - Debug version with connection testing
import { supabase } from '../lib/supabase'
import { 
  Company, 
  EmissionData, 
  EnergyConsumption, 
  Transportation, 
  SupplyChain, 
  AIInsight 
} from '../types/database'

export class CarbonAnalysisService {
  // Enhanced error logging
  private static logError(operation: string, error: any, additionalInfo?: any): void {
    console.error(`[CarbonAnalysisService] ${operation} hatası:`, {
      error,
      message: error?.message || 'Bilinmeyen hata',
      code: error?.code || 'NO_CODE',
      details: error?.details || 'Detay yok',
      hint: error?.hint || 'İpucu yok',
      status: error?.status || 'NO_STATUS',
      statusText: error?.statusText || 'NO_STATUS_TEXT',
      additionalInfo
    });
  }

  // Veritabanı bağlantısını test et
  static async testConnection(): Promise<{ success: boolean; error?: any; tableCount?: number }> {
    try {
      console.log('[CarbonAnalysisService] Veritabanı bağlantısı test ediliyor...');
      
      // Basit bir sorgu dene
      const { data, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.error('[CarbonAnalysisService] Bağlantı testi başarısız:', error);
        return { success: false, error };
      }

      console.log('[CarbonAnalysisService] Bağlantı testi başarılı! Şirket sayısı:', count);
      console.log('[CarbonAnalysisService] Örnek data:', data);
      
      return { success: true, tableCount: count || 0 };
    } catch (error) {
      console.error('[CarbonAnalysisService] Bağlantı testi hatası:', error);
      return { success: false, error };
    }
  }

  // Supabase config'i kontrol et
  static checkSupabaseConfig(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      issues.push('NEXT_PUBLIC_SUPABASE_URL environment variable eksik');
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable eksik');
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes('supabase.co')) {
      issues.push('SUPABASE_URL formatı geçersiz görünüyor');
    }

    console.log('[CarbonAnalysisService] Supabase config kontrol:', {
      url: url ? `${url.substring(0, 30)}...` : 'YOK',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'MEVCUT' : 'YOK',
      issues
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  // Tüm şirketleri getir
  static async getAllCompanies(): Promise<Company[]> {
    try {
      console.log('[CarbonAnalysisService] Tüm şirketler getiriliyor...');
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('company_name', { ascending: true });

      console.log('[CarbonAnalysisService] Companies query sonucu:', { data, error });

      if (error) {
        this.logError('Şirket listesi getirme', error);
        return [];
      }

      console.log(`[CarbonAnalysisService] ${data?.length || 0} şirket bulundu`);
      return data || [];
    } catch (error) {
      this.logError('Şirket listesi getirme (beklenmeyen)', error);
      return [];
    }
  }

  // Şirket verilerini getir
  static async getCompany(companyId: number): Promise<Company | null> {
    try {
      console.log(`[CarbonAnalysisService] Şirket getiriliyor: ID ${companyId}`);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', companyId)
        .single();

      console.log('[CarbonAnalysisService] Company query sonucu:', { data, error, companyId });

      if (error) {
        this.logError('Şirket verisi getirme', error, { companyId });
        return null;
      }

      console.log(`[CarbonAnalysisService] Şirket bulundu: ${data?.company_name}`);
      return data;
    } catch (error) {
      this.logError('Şirket verisi getirme (beklenmeyen)', error, { companyId });
      return null;
    }
  }

  // Emisyon verilerini getir (son 3 yıl)
  static async getEmissionsData(companyId: number): Promise<EmissionData[]> {
    try {
      console.log(`[CarbonAnalysisService] Emisyon verileri getiriliyor: Company ID ${companyId}`);
      
      const { data, error } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('company_id', companyId)
        .order('reporting_year', { ascending: false })
        .limit(3);

      console.log('[CarbonAnalysisService] Emissions query sonucu:', { data, error, companyId });

      if (error) {
        this.logError('Emisyon verisi getirme', error, { companyId });
        return [];
      }

      console.log(`[CarbonAnalysisService] ${data?.length || 0} emisyon kaydı bulundu`);
      return data || [];
    } catch (error) {
      this.logError('Emisyon verisi getirme (beklenmeyen)', error, { companyId });
      return [];
    }
  }

  // Test için sample company oluştur
  static async createSampleCompany(): Promise<Company | null> {
    try {
      console.log('[CarbonAnalysisService] Sample company oluşturuluyor...');
      
      const sampleCompany = {
        company_name: 'Test Şirketi A.Ş.',
        industry_sector: 'Teknoloji',
        employee_count: 150,
        annual_revenue: 10000000,
        headquarters_location: 'İstanbul, Türkiye'
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([sampleCompany])
        .select()
        .single();

      if (error) {
        this.logError('Sample company oluşturma', error, { sampleCompany });
        return null;
      }

      console.log('[CarbonAnalysisService] Sample company oluşturuldu:', data);
      return data;
    } catch (error) {
      this.logError('Sample company oluşturma (beklenmeyen)', error);
      return null;
    }
  }

  // Enerji tüketim verilerini getir (son 12 ay)
  static async getEnergyConsumption(companyId: number): Promise<EnergyConsumption[]> {
    try {
      console.log(`[CarbonAnalysisService] Enerji verileri getiriliyor: Company ID ${companyId}`);
      
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data, error } = await supabase
        .from('energy_consumption')
        .select('*')
        .eq('company_id', companyId)
        .gte('measurement_date', oneYearAgo.toISOString().split('T')[0])
        .order('measurement_date', { ascending: false });

      console.log('[CarbonAnalysisService] Energy query sonucu:', { data, error, companyId });

      if (error) {
        this.logError('Enerji verisi getirme', error, { companyId });
        return [];
      }

      console.log(`[CarbonAnalysisService] ${data?.length || 0} enerji kaydı bulundu`);
      return data || [];
    } catch (error) {
      this.logError('Enerji verisi getirme (beklenmeyen)', error, { companyId });
      return [];
    }
  }

  // Ulaşım verilerini getir
  static async getTransportationData(companyId: number): Promise<Transportation[]> {
    try {
      console.log(`[CarbonAnalysisService] Ulaşım verileri getiriliyor: Company ID ${companyId}`);
      
      const { data, error } = await supabase
        .from('transportation')
        .select('*')
        .eq('company_id', companyId)
        .order('measurement_date', { ascending: false })
        .limit(12);

      console.log('[CarbonAnalysisService] Transportation query sonucu:', { data, error, companyId });

      if (error) {
        this.logError('Ulaşım verisi getirme', error, { companyId });
        return [];
      }

      console.log(`[CarbonAnalysisService] ${data?.length || 0} ulaşım kaydı bulundu`);
      return data || [];
    } catch (error) {
      this.logError('Ulaşım verisi getirme (beklenmeyen)', error, { companyId });
      return [];
    }
  }

  // Tedarik zinciri verilerini getir
  static async getSupplyChainData(companyId: number): Promise<SupplyChain[]> {
    try {
      console.log(`[CarbonAnalysisService] Tedarik zinciri verileri getiriliyor: Company ID ${companyId}`);
      
      const { data, error } = await supabase
        .from('supply_chain')
        .select('*')
        .eq('company_id', companyId)
        .order('calculated_scope3_emissions', { ascending: false });

      console.log('[CarbonAnalysisService] Supply chain query sonucu:', { data, error, companyId });

      if (error) {
        this.logError('Tedarik zinciri verisi getirme', error, { companyId });
        return [];
      }

      console.log(`[CarbonAnalysisService] ${data?.length || 0} tedarikçi kaydı bulundu`);
      return data || [];
    } catch (error) {
      this.logError('Tedarik zinciri verisi getirme (beklenmeyen)', error, { companyId });
      return [];
    }
  }

  // AI analizlerini getir
  static async getAIInsights(companyId: number): Promise<AIInsight[]> {
    try {
      console.log(`[CarbonAnalysisService] AI insights getiriliyor: Company ID ${companyId}`);
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('company_id', companyId)
        .order('analysis_date', { ascending: false })
        .limit(10);

      console.log('[CarbonAnalysisService] AI insights query sonucu:', { data, error, companyId });

      if (error) {
        this.logError('AI analiz verisi getirme', error, { companyId });
        return [];
      }

      console.log(`[CarbonAnalysisService] ${data?.length || 0} AI insight bulundu`);
      return data || [];
    } catch (error) {
      this.logError('AI analiz verisi getirme (beklenmeyen)', error, { companyId });
      return [];
    }
  }

  // Hesaplama yardımcı fonksiyonları
  static calculateTotalEmissions(emissionData: EmissionData): number {
    const scope1 = emissionData.scope1_total_co2_kg || 0;
    const scope2 = emissionData.scope2_location_based || 0;
    const scope3 = emissionData.scope3_total_co2_kg || 0;
    return scope1 + scope2 + scope3;
  }

  static calculateEmissionChange(current: EmissionData, previous: EmissionData): number {
    const currentTotal = this.calculateTotalEmissions(current);
    const previousTotal = this.calculateTotalEmissions(previous);
    
    if (previousTotal === 0) return 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  }

  static calculateRenewableEnergyRatio(energyData: EnergyConsumption[]): number {
    const totalRenewable = energyData.reduce((sum, item) => sum + (item.electricity_renewable_kwh || 0), 0);
    const totalConsumption = energyData.reduce((sum, item) => sum + (item.electricity_total_kwh || 0), 0);
    
    if (totalConsumption === 0) return 0;
    return (totalRenewable / totalConsumption) * 100;
  }

  static formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  static formatCO2(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + ' tCO2';
    }
    return value.toFixed(0) + ' kg';
  }
}