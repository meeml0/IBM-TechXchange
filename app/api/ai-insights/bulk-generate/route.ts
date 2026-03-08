// app/api/ai-insights/bulk-generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

/**
 * POST /api/ai-insights/bulk-generate
 * Tüm şirketler için AI insights oluşturur (scheduled task için)
 */
export async function POST(request: NextRequest) {
  try {
    // Basit authentication kontrolü
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.INTERNAL_API_KEY || 'your-secret-key'}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Bulk AI-Insights API] Toplu AI analizi başlatılıyor...');

    // Tüm şirketleri al
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .order('company_id');
      
    if (companiesError) {
      console.error('[Bulk AI-Insights] Şirket listesi alma hatası:', companiesError);
      return NextResponse.json(
        { error: 'Şirket listesi alınamadı: ' + companiesError.message },
        { status: 500 }
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    // Her şirket için AI insight oluştur
    for (const company of companies || []) {
      try {
        console.log(`[Bulk AI-Insights] ${company.company_name} için analiz başlatılıyor...`);
        
        // Internal API'yi çağır
        const response = await fetch(`${request.nextUrl.origin}/api/ai-insights/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ companyId: company.company_id })
        });

        if (response.ok) {
          const result = await response.json();
          results.push({
            companyId: company.company_id,
            companyName: company.company_name,
            success: true,
            insightsCount: result.insights?.length || 0,
            usedWatson: result.usedWatson || false
          });
          successCount++;
        } else {
          const errorResult = await response.json().catch(() => ({}));
          results.push({
            companyId: company.company_id,
            companyName: company.company_name,
            success: false,
            error: errorResult.error || `HTTP ${response.status}`
          });
          errorCount++;
        }

        // Rate limiting için bekleme
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`[Bulk AI-Insights] ${company.company_name} analiz hatası:`, error);
        results.push({
          companyId: company.company_id,
          companyName: company.company_name,
          success: false,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        });
        errorCount++;
      }
    }

    console.log(`[Bulk AI-Insights] Toplu analiz tamamlandı: ${successCount} başarılı, ${errorCount} hata`);

    return NextResponse.json({
      success: true,
      summary: {
        total: companies?.length || 0,
        successful: successCount,
        failed: errorCount
      },
      results,
      message: `Toplu analiz tamamlandı: ${successCount} başarılı, ${errorCount} hata`
    });

  } catch (error) {
    console.error('[Bulk AI-Insights API] Hata:', error);
    return NextResponse.json(
      { 
        error: 'Toplu AI analizi başarısız',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}