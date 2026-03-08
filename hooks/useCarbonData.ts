// hooks/useCarbonData.ts - Enhanced hook with AI insights integration (TypeScript fixed)
import { useState, useEffect } from 'react'
import { CarbonAnalysisService } from '../services/carbonAnalysisService'
import { 
  Company, 
  EmissionData, 
  EnergyConsumption, 
  Transportation, 
  SupplyChain, 
  AIInsight 
} from '../types/database'

interface CarbonDataState {
  company: Company | null
  emissions: EmissionData[]
  energy: EnergyConsumption[]
  transportation: Transportation[]
  supplyChain: SupplyChain[]
  aiInsights: AIInsight[]
  loading: boolean
  error: string | null
  isUsingMockData: boolean
  lastUpdated: Date | null
}

interface LoadingStates {
  company: boolean
  emissions: boolean
  energy: boolean
  transportation: boolean
  supplyChain: boolean
  aiInsights: boolean
}

export const useCarbonData = (companyId: number) => {
  const [data, setData] = useState<CarbonDataState>({
    company: null,
    emissions: [],
    energy: [],
    transportation: [],
    supplyChain: [],
    aiInsights: [],
    loading: true,
    error: null,
    isUsingMockData: false,
    lastUpdated: null
  })

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    company: false,
    emissions: false,
    energy: false,
    transportation: false,
    supplyChain: false,
    aiInsights: false
  })

  const updateLoadingState = (key: keyof LoadingStates, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }))
  }

  const isAnyLoading = () => {
    return Object.values(loadingStates).some(loading => loading)
  }

  // Safe date parsing helper
  const safeParseDate = (dateString: string | null): Date => {
    if (!dateString) return new Date()
    try {
      const parsed = new Date(dateString)
      return isNaN(parsed.getTime()) ? new Date() : parsed
    } catch {
      return new Date()
    }
  }

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      console.log(`[useCarbonData] Veri çekme başlatılıyor - Company ID: ${companyId}`)

      const startTime = Date.now()
      let hasErrors = false
      let isUsingMockData = false

      // Paralel olarak tüm verileri çek, ancak her birini ayrı ayrı takip et
      const dataPromises = [
        // Company data
        (async () => {
          updateLoadingState('company', true)
          try {
            const company = await CarbonAnalysisService.getCompany(companyId)
            if (company?.company_name === 'Acme Corporation') {
              isUsingMockData = true
            }
            return { company }
          } catch (error) {
            console.error('[useCarbonData] Company veri hatası:', error)
            hasErrors = true
            return { company: null }
          } finally {
            updateLoadingState('company', false)
          }
        })(),

        // Emissions data
        (async () => {
          updateLoadingState('emissions', true)
          try {
            const emissions = await CarbonAnalysisService.getEmissionsData(companyId)
            return { emissions }
          } catch (error) {
            console.error('[useCarbonData] Emissions veri hatası:', error)
            hasErrors = true
            return { emissions: [] }
          } finally {
            updateLoadingState('emissions', false)
          }
        })(),

        // Energy data
        (async () => {
          updateLoadingState('energy', true)
          try {
            const energy = await CarbonAnalysisService.getEnergyConsumption(companyId)
            return { energy }
          } catch (error) {
            console.error('[useCarbonData] Energy veri hatası:', error)
            hasErrors = true
            return { energy: [] }
          } finally {
            updateLoadingState('energy', false)
          }
        })(),

        // Transportation data
        (async () => {
          updateLoadingState('transportation', true)
          try {
            const transportation = await CarbonAnalysisService.getTransportationData(companyId)
            return { transportation }
          } catch (error) {
            console.error('[useCarbonData] Transportation veri hatası:', error)
            hasErrors = true
            return { transportation: [] }
          } finally {
            updateLoadingState('transportation', false)
          }
        })(),

        // Supply chain data
        (async () => {
          updateLoadingState('supplyChain', true)
          try {
            const supplyChain = await CarbonAnalysisService.getSupplyChainData(companyId)
            return { supplyChain }
          } catch (error) {
            console.error('[useCarbonData] Supply chain veri hatası:', error)
            hasErrors = true
            return { supplyChain: [] }
          } finally {
            updateLoadingState('supplyChain', false)
          }
        })(),

        // AI insights data
        (async () => {
          updateLoadingState('aiInsights', true)
          try {
            const aiInsights = await CarbonAnalysisService.getAIInsights(companyId)
            return { aiInsights }
          } catch (error) {
            console.error('[useCarbonData] AI insights veri hatası:', error)
            hasErrors = true
            return { aiInsights: [] }
          } finally {
            updateLoadingState('aiInsights', false)
          }
        })()
      ]

      // Tüm promise'lerin tamamlanmasını bekle
      const results = await Promise.allSettled(dataPromises)
      
      const endTime = Date.now()
      console.log(`[useCarbonData] Veri çekme tamamlandı - Süre: ${endTime - startTime}ms`)

      // Sonuçları birleştir
      let finalData = {
        company: null as Company | null,
        emissions: [] as EmissionData[],
        energy: [] as EnergyConsumption[],
        transportation: [] as Transportation[],
        supplyChain: [] as SupplyChain[],
        aiInsights: [] as AIInsight[]
      }

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value
          finalData = { ...finalData, ...data }
        } else {
          console.error(`[useCarbonData] Promise ${index} başarısız:`, result.reason)
          hasErrors = true
        }
      })

      // Veri kalite kontrolü
      const dataQuality = {
        hasCompany: !!finalData.company,
        hasEmissions: finalData.emissions.length > 0,
        hasEnergy: finalData.energy.length > 0,
        hasTransportation: finalData.transportation.length > 0,
        hasSupplyChain: finalData.supplyChain.length > 0,
        hasAIInsights: finalData.aiInsights.length > 0
      }

      console.log('[useCarbonData] Veri kalitesi:', dataQuality)

      setData({
        ...finalData,
        loading: false,
        error: hasErrors ? 'Bazı veriler yüklenirken hata oluştu, ancak mevcut veriler gösteriliyor' : null,
        isUsingMockData,
        lastUpdated: new Date()
      })

      // Başarı mesajı
      if (!hasErrors && finalData.company) {
        console.log(`[useCarbonData] ${finalData.company.company_name} için tüm veriler başarıyla yüklendi`)
      }

    } catch (error) {
      console.error('[useCarbonData] Beklenmeyen hata:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Veriler yüklenirken beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.'
      }))
    }
  }

  // Belirli bir veri tipini yeniden yükle
  const refetchSpecific = async (dataType: keyof LoadingStates) => {
    try {
      updateLoadingState(dataType, true)
      
      switch (dataType) {
        case 'company': {
          const result = await CarbonAnalysisService.getCompany(companyId)
          setData(prev => ({ ...prev, company: result }))
          break
        }
        case 'emissions': {
          const result = await CarbonAnalysisService.getEmissionsData(companyId)
          setData(prev => ({ ...prev, emissions: result }))
          break
        }
        case 'energy': {
          const result = await CarbonAnalysisService.getEnergyConsumption(companyId)
          setData(prev => ({ ...prev, energy: result }))
          break
        }
        case 'transportation': {
          const result = await CarbonAnalysisService.getTransportationData(companyId)
          setData(prev => ({ ...prev, transportation: result }))
          break
        }
        case 'supplyChain': {
          const result = await CarbonAnalysisService.getSupplyChainData(companyId)
          setData(prev => ({ ...prev, supplyChain: result }))
          break
        }
        case 'aiInsights': {
          const result = await CarbonAnalysisService.getAIInsights(companyId)
          setData(prev => ({ ...prev, aiInsights: result }))
          break
        }
      }
      
      console.log(`[useCarbonData] ${dataType} verisi başarıyla yenilendi`)
    } catch (error) {
      console.error(`[useCarbonData] ${dataType} yenileme hatası:`, error)
    } finally {
      updateLoadingState(dataType, false)
    }
  }

  // Hızlı veri yenileme (sadece değişmiş olabilecek verileri)
  const refreshRecentData = async () => {
    console.log('[useCarbonData] Güncel veriler yenileniyor...')
    await Promise.all([
      refetchSpecific('energy'),
      refetchSpecific('transportation'),
      refetchSpecific('aiInsights')
    ])
  }

  // AI insights'ları yeniden oluştur
  const generateAIInsights = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, aiInsights: true }))
      console.log(`[useCarbonData] ${companyId} için AI insights oluşturuluyor...`)
      
      const response = await fetch('/api/ai-insights/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `AI insights API hatası: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.insights) {
        // AI insights'ları güncelle
        setData(prev => ({ 
          ...prev, 
          aiInsights: result.insights,
          lastUpdated: new Date(),
          error: null // Clear any previous errors
        }))
        console.log(`[useCarbonData] ${result.insights.length} AI insight oluşturuldu`)
        
        // Success notification (optional)
        if (typeof window !== 'undefined') {
          console.log('✅ Watson AI analizi başarıyla tamamlandı!')
        }
      } else {
        throw new Error(result.error || 'AI insights oluşturulamadı')
      }
      
    } catch (error) {
      console.error('[useCarbonData] AI insights oluşturma hatası:', error)
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'AI insights oluşturulurken hata oluştu'
      }))
      
      // Error notification (optional)
      if (typeof window !== 'undefined') {
        console.error('❌ Watson AI analizi başarısız:', error)
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, aiInsights: false }))
    }
  }

  // Veri istatistikleri
  const getDataStats = () => {
    return {
      totalEmissions: data.emissions.length > 0 
        ? CarbonAnalysisService.calculateTotalEmissions(data.emissions[0]) 
        : 0,
      renewableRatio: CarbonAnalysisService.calculateRenewableEnergyRatio(data.energy),
      facilitiesCount: new Set(data.energy.map(e => e.facility_name)).size,
      insightsCount: data.aiInsights.length,
      suppliersCount: data.supplyChain.length,
      lastEmissionYear: data.emissions.length > 0 ? data.emissions[0].reporting_year : null,
      hasRecentInsights: data.aiInsights.some(insight => {
        if (!insight.analysis_date) return false
        const insightDate = safeParseDate(insight.analysis_date)
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)
        return insightDate > oneDayAgo
      }),
      totalPotentialCO2Reduction: data.aiInsights.reduce((sum, insight) => 
        sum + (insight.potential_co2_reduction_kg || 0), 0),
      totalPotentialCostSavings: data.aiInsights.reduce((sum, insight) => 
        sum + (insight.estimated_cost_savings || 0), 0),
    }
  }

  // Automatic AI insights generation (optional - can be triggered on first load)
  const autoGenerateInsightsIfNeeded = async () => {
    // Only auto-generate if:
    // 1. Company data exists
    // 2. No recent AI insights (older than 7 days)
    // 3. Not currently loading anything
    if (!data.company || isAnyLoading()) return

    const hasRecentInsights = data.aiInsights.some(insight => {
      if (!insight.analysis_date) return false
      const insightDate = safeParseDate(insight.analysis_date)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return insightDate > sevenDaysAgo
    })

    if (!hasRecentInsights && data.aiInsights.length === 0) {
      console.log('[useCarbonData] No recent insights found, auto-generating...')
      // Uncomment the line below if you want automatic generation
      // await generateAIInsights()
    }
  }

  // Check if AI insights are stale (older than 7 days)
  const areInsightsStale = () => {
    if (data.aiInsights.length === 0) return true
    
    // Find the latest insight with safe date parsing
    const latestInsight = data.aiInsights.reduce((latest, insight) => {
      if (!insight.analysis_date) return latest
      if (!latest.analysis_date) return insight
      
      const insightDate = safeParseDate(insight.analysis_date)
      const latestDate = safeParseDate(latest.analysis_date)
      return insightDate > latestDate ? insight : latest
    }, data.aiInsights[0])
    
    if (!latestInsight?.analysis_date) return true
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return safeParseDate(latestInsight.analysis_date) < sevenDaysAgo
  }

  useEffect(() => {
    if (companyId && companyId > 0) {
      console.log(`[useCarbonData] useEffect tetiklendi - Company ID: ${companyId}`)
      fetchData()
    } else {
      console.warn('[useCarbonData] Geçersiz company ID:', companyId)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Geçersiz şirket ID\'si'
      }))
    }
  }, [companyId])

  // Auto-generate insights if needed (after initial data load)
  useEffect(() => {
    if (!data.loading && data.company && !loadingStates.aiInsights) {
      autoGenerateInsightsIfNeeded()
    }
  }, [data.loading, data.company, data.aiInsights.length])

  // Debug bilgileri için
  useEffect(() => {
    const anyLoading = isAnyLoading()
    setData(prev => ({ ...prev, loading: anyLoading }))
  }, [loadingStates])

  return { 
    ...data, 
    refetch: fetchData,
    refetchSpecific,
    refreshRecentData,
    generateAIInsights,
    loadingStates,
    isAnyLoading: isAnyLoading(),
    dataStats: getDataStats(),
    areInsightsStale: areInsightsStale(),
    autoGenerateInsightsIfNeeded
  }
}