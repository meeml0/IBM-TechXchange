// app/api/ai-insights/generate/route.ts - English Version
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// Watson AI Service functions (simplified version for this API)
async function getWatsonAccessToken(): Promise<string> {
  const API_KEY = process.env.WATSONX_API_KEY!;
  
  try {
    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": API_KEY
      })
    });

    if (!response.ok) {
      throw new Error(`Token retrieval error: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Watson token error:", error);
    throw error;
  }
}

async function callWatsonAI(prompt: string): Promise<string> {
  try {
    const accessToken = await getWatsonAccessToken();
    
    const response = await fetch(
      `${process.env.WATSONX_API_URL}?version=2023-05-29`,
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
              content: `You are an expert carbon footprint analyst. You provide practical, actionable recommendations to companies for reducing their carbon emissions.

RESPONSE FORMAT:
[TITLE]: Short title
[DESCRIPTION]: Detailed description
[CO2_REDUCTION]: Number only (kg)
[COST_SAVINGS]: Number only (USD)
[DIFFICULTY]: Low, Medium, or High

Provide 3 recommendations: immediate, medium-term, long-term.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          project_id: process.env.WATSONX_PROJECT_ID!,
          model_id: 'ibm/granite-3-8b-instruct',
          frequency_penalty: 0,
          max_tokens: 2500,
          presence_penalty: 0,
          temperature: 0.7,
          top_p: 1
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Watson AI API error: ${response.status}`);
    }

    const data = await response.json();
    
    let aiContent = '';
    if (data.choices && data.choices.length > 0) {
      aiContent = data.choices[0].message.content;
    } else if (data.results && data.results.length > 0) {
      aiContent = data.results[0].generated_text;
    } else {
      aiContent = "Analysis completed, but detailed response could not be retrieved.";
    }
    
    return aiContent;
  } catch (error) {
    console.error('Watson AI error:', error);
    throw error;
  }
}

function parseAIResponse(aiContent: string, companyId: number) {
  const insights = [];
  
  try {
    const lines = aiContent.split('\n').filter(line => line.trim().length > 0);
    let currentInsight: any = {};
    
    for (const line of lines) {
      if (line.startsWith('[TITLE]:') || line.startsWith('[BAŞLIK]:')) {
        if (currentInsight.insight_title) {
          insights.push({ ...currentInsight });
        }
        currentInsight = {
          company_id: companyId,
          insight_title: line.replace(/\[TITLE\]:\s*|\[BAŞLIK\]:\s*/g, '').trim(),
          insight_type: 'Watson AI Recommendation',
          analysis_date: new Date().toISOString().split('T')[0]
        };
      }
      else if (line.startsWith('[DESCRIPTION]:') || line.startsWith('[AÇIKLAMA]:')) {
        currentInsight.insight_description = line.replace(/\[DESCRIPTION\]:\s*|\[AÇIKLAMA\]:\s*/g, '').trim();
      }
      else if (line.startsWith('[CO2_REDUCTION]:') || line.startsWith('[CO2_AZALTIM]:')) {
        const co2Text = line.replace(/\[CO2_REDUCTION\]:\s*|\[CO2_AZALTIM\]:\s*/g, '').trim();
        const co2Match = co2Text.match(/(\d+(?:\.\d+)?)/);
        if (co2Match) {
          currentInsight.potential_co2_reduction_kg = parseFloat(co2Match[1]);
        }
      }
      else if (line.startsWith('[COST_SAVINGS]:') || line.startsWith('[MALIYET_TASARRUF]:')) {
        const costText = line.replace(/\[COST_SAVINGS\]:\s*|\[MALIYET_TASARRUF\]:\s*/g, '').trim();
        const costMatch = costText.match(/(\d+(?:\.\d+)?)/);
        if (costMatch) {
          currentInsight.estimated_cost_savings = parseFloat(costMatch[1]);
        }
      }
      else if (line.startsWith('[DIFFICULTY]:') || line.startsWith('[ZORLUK]:')) {
        currentInsight.implementation_complexity = line.replace(/\[DIFFICULTY\]:\s*|\[ZORLUK\]:\s*/g, '').trim();
      }
    }
    
    if (currentInsight.insight_title) {
      insights.push({ ...currentInsight });
    }
    
  } catch (error) {
    console.error('AI response parsing error:', error);
  }
  
  // If parsing fails, add fallback insight
  if (insights.length === 0) {
    insights.push({
      company_id: companyId,
      insight_title: 'Energy Efficiency Optimization',
      insight_description: 'Switch to LED lighting and implement smart thermostats to reduce energy consumption by up to 60%.',
      insight_type: 'Watson AI Default',
      potential_co2_reduction_kg: 5000,
      estimated_cost_savings: 25000,
      implementation_complexity: 'Low',
      analysis_date: new Date().toISOString().split('T')[0],
      confidence_score: 0.75
    });
  }
  
  // Add confidence_score to each insight
  return insights.map(insight => ({
    ...insight,
    confidence_score: insight.confidence_score || 0.85
  }));
}

/**
 * POST /api/ai-insights/generate
 * Creates AI insights for a specific company
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    if (!companyId || typeof companyId !== 'number') {
      return NextResponse.json(
        { error: 'Valid company ID is required' },
        { status: 400 }
      );
    }

    console.log(`[AI-Insights API] Starting AI analysis for company ${companyId}...`);

    // Get company information
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Collect company data
    const [emissions, energy, transportation, supplyChain] = await Promise.all([
      supabase.from('emissions_data').select('*').eq('company_id', companyId).order('reporting_year', { ascending: false }).limit(3),
      supabase.from('energy_consumption').select('*').eq('company_id', companyId).order('measurement_date', { ascending: false }).limit(12),
      supabase.from('transportation').select('*').eq('company_id', companyId).order('measurement_date', { ascending: false }).limit(12),
      supabase.from('supply_chain').select('*').eq('company_id', companyId).order('annual_co2_kg', { ascending: false })
    ]);

    // Create analysis prompt
    const currentEmissions = emissions.data?.[0];
    const totalEmissions = currentEmissions ? 
      (currentEmissions.scope1_total_co2_kg || 0) + 
      (currentEmissions.scope2_location_based || 0) + 
      (currentEmissions.scope3_total_co2_kg || 0) : 0;

    const prompt = `
🌍 CARBON FOOTPRINT ANALYSIS REPORT

COMPANY: ${company.company_name}
SECTOR: ${company.industry_sector || 'General'}
TOTAL EMISSIONS: ${(totalEmissions / 1000).toFixed(1)} tCO2e/year

Prepare 3 carbon reduction recommendations for this company:

1. IMMEDIATE (1-3 months): Quick wins, low cost
2. MEDIUM-TERM (3-12 months): Balanced risk-return  
3. LONG-TERM (12+ months): Transformative

Format for each recommendation:
[TITLE]: Clear title
[DESCRIPTION]: Implementation steps
[CO2_REDUCTION]: Annual CO2 reduction (kg)
[COST_SAVINGS]: Annual savings (USD)
[DIFFICULTY]: Low/Medium/High`;

    // Get response from Watson AI (if credentials available)
    let aiContent = '';
    let useWatson = false;
    
    try {
      if (process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID) {
        aiContent = await callWatsonAI(prompt);
        useWatson = true;
        console.log('Watson AI response received');
      }
    } catch (watsonError) {
      console.warn('Watson AI error, using fallback:', watsonError);
      useWatson = false;
    }

    // Fallback response (if Watson AI doesn't work)
    if (!useWatson || !aiContent) {
      aiContent = `
[TITLE]: LED Lighting Upgrade
[DESCRIPTION]: Switch all facilities to LED lighting systems. Provides 60% energy savings with immediate impact on electricity bills.
[CO2_REDUCTION]: 5000
[COST_SAVINGS]: 15000
[DIFFICULTY]: Low

[TITLE]: Renewable Energy Procurement
[DESCRIPTION]: Sign renewable energy supply agreements for solar or wind power to reduce Scope 2 emissions significantly.
[CO2_REDUCTION]: 25000
[COST_SAVINGS]: 50000
[DIFFICULTY]: Medium

[TITLE]: Carbon-Neutral Supply Chain
[DESCRIPTION]: Implement carbon-neutral certification requirements for suppliers to reduce Scope 3 emissions.
[CO2_REDUCTION]: 15000
[COST_SAVINGS]: 30000
[DIFFICULTY]: High`;
      console.log('Fallback response used');
    }

    // Parse AI response
    const parsedInsights = parseAIResponse(aiContent, companyId);

    // Delete old Watson AI insights (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    await supabase
      .from('ai_insights')
      .delete()
      .eq('company_id', companyId)
      .like('insight_type', '%Watson AI%')
      .gte('created_at', threeDaysAgo.toISOString());

    // Save new insights
    const { data: savedInsights, error: insertError } = await supabase
      .from('ai_insights')
      .insert(parsedInsights)
      .select('*');

    if (insertError) {
      console.error('[AI-Insights API] Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Database insert error: ' + insertError.message },
        { status: 500 }
      );
    }

    console.log(`[AI-Insights API] ${savedInsights?.length || 0} insights created`);

    return NextResponse.json({
      success: true,
      insights: savedInsights,
      message: `${savedInsights?.length || 0} AI insights created for ${company.company_name}`,
      usedWatson: useWatson
    });

  } catch (error) {
    console.error('[AI-Insights API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Error creating AI insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-insights/generate?companyId=123
 * Retrieves existing AI insights for a specific company
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID parameter required' },
        { status: 400 }
      );
    }

    const { data: insights, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('company_id', parseInt(companyId))
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      insights,
      count: insights?.length || 0
    });

  } catch (error) {
    console.error('[AI-Insights API] GET Error:', error);
    return NextResponse.json(
      { 
        error: 'Error retrieving AI insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}