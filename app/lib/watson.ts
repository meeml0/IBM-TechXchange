// lib/watson.ts
export async function getWatsonAccessToken() {
    const API_KEY = process.env.WATSONX_API_KEY!;
    
    try {
      const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: new URLSearchParams({
          "grant_type": "urn:ibm:params:oauth:grant-type:apikey", // ✅ Python kodundaki doğru grant_type
          "apikey": API_KEY
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Watson token hatası:', response.status, errorText);
        throw new Error(`Token alma hatası: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Watson access token alındı başarıyla');
      return data.access_token;
    } catch (error) {
      console.error("Watson token hatası:", error);
      throw error;
    }
  }
  
  export async function generateWatsonInsight(prompt: string) {
    try {
      console.log('Watson AI API çağrısı yapılıyor...');
      
      // Access token al
      const accessToken = await getWatsonAccessToken();
      console.log('Access token alındı, AI çağrısı yapılıyor...');
      
      // Python kodundaki URL ve parametreleri kullan
      const response = await fetch(
        `${process.env.WATSONX_API_URL}?version=2023-05-29`, // Python'daki gibi version ekle
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'Sen uzman bir karbon ayak izi analiz uzmanısın. Türkçe yanıt ver. Kısa, net ve pratik öneriler sun.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            project_id: process.env.WATSONX_PROJECT_ID!,
            model_id: 'ibm/granite-3-3-8b-instruct', // Granite model
            frequency_penalty: 0,
            max_tokens: 2000,
            presence_penalty: 0,
            temperature: 0.5,
            top_p: 1
          })
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Watson AI API hatası:', response.status, errorText);
        throw new Error(`Watson AI API error: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Watson AI yanıtı alındı:', data);
      
      // Python kodundaki gibi response parse et
      let aiContent = '';
      if (data.choices && data.choices.length > 0) {
        aiContent = data.choices[0].message.content;
      } else if (data.results && data.results.length > 0) {
        aiContent = data.results[0].generated_text;
      } else {
        aiContent = "Analiz tamamlandı, ancak detaylı yanıt alınamadı.";
      }
      
      // Chat response olarak döndür
      return {
        type: 'Chat Response',
        title: 'AI Yanıtı',
        description: aiContent,
        confidence: 0.85,
        co2_reduction: 0,
        cost_savings: 0,
        complexity: 'Medium'
      };
      
    } catch (error) {
      console.error('Watson AI hatası:', error);
      
      // Fallback response
      return {
        type: 'Fallback Response',
        title: 'Varsayılan Yanıt',
        description: 'Üzgünüm, AI servisi şu anda yanıt veremiyor. Lütfen daha sonra tekrar deneyin.',
        confidence: 0.60,
        co2_reduction: 0,
        cost_savings: 0,
        complexity: 'Low'
      };
    }
  }