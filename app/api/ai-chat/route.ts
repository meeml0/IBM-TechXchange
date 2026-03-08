// api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateWatsonInsight } from '@/app/lib/watson';

// GET method for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'AI Chat endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('AI Chat POST request received');
    
    const body = await request.json();
    const { type, company_data, user_message, conversation_state, collected_data } = body;

    console.log('Request body:', { type, company_data: !!company_data });

    if (type === 'start_analysis') {
      // İlk karşılama mesajını oluştur
      const welcomePrompt = `
      Şirket Bilgileri: ${JSON.stringify(company_data)}
      
      Sen bir karbon ayak izi analiz uzmanısın. Bu şirket için kişiselleştirilmiş bir karşılama mesajı yaz ve ilk soruyu sor.
      
      Şirket adı: ${company_data?.name || 'Bilinmeyen'}
      Sektör: ${company_data?.industry || 'Genel'}
      
      Doğal, samimi ve profesyonel bir ton kullan. İlk soruyu da dahil et.
      `;

      const response = await generateWatsonInsight(welcomePrompt);
      
      return NextResponse.json({
        message: response.description || `Merhaba! ${company_data?.name || 'Şirketiniz'} için karbon ayak izi analizi yapmak üzere buradayım. İlk olarak, aylık ortalama enerji tüketiminiz hakkında bilgi verebilir misiniz?`,
        phase: 'questioning'
      });
    }

    if (type === 'continue_conversation') {
      // Kullanıcının yanıtını analiz et ve sonraki soruyu oluştur
      const conversationPrompt = `
      Şirket: ${JSON.stringify(company_data)}
      
      Kullanıcının son yanıtı: "${user_message}"
      
      Şimdiye kadar toplanan veriler: ${JSON.stringify(collected_data)}
      
      Soru sayısı: ${conversation_state?.questionCount || 0}
      
      Sen bir karbon ayak izi uzmanısın. Kullanıcının yanıtını analiz et ve:
      
      1. Eğer henüz yeterli veri toplanmadıysa (5-8 soru), mantıklı bir sonraki soru sor
      2. Sorular şirketin sektörüne uygun olsun
      3. Derinlemesine analiz için takip soruları sor
      4. Eğer yeterli veri toplandıysa, analizi tamamlayacağını belirt
      
      Doğal konuşma tonunda yanıt ver.
      `;

      const response = await generateWatsonInsight(conversationPrompt);
      
      // 5+ soru sorulduysa analizi tamamla
      const shouldComplete = (conversation_state?.questionCount || 0) >= 5;
      
      return NextResponse.json({
        message: response.description || 'Teşekkürler! Bir sonraki soruya geçelim...',
        phase: shouldComplete ? 'completed' : 'questioning'
      });
    }

    return NextResponse.json({ error: 'Geçersiz tip' }, { status: 400 });

  } catch (error) {
    console.error('AI Chat hatası:', error);
    return NextResponse.json(
      { error: 'AI Chat hatası', message: 'Özür dilerim, bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}