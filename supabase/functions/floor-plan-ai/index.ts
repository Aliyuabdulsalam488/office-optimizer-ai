import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, planData, prompt, action, canvasData, floorPlanData, systemPrompt: customSystemPrompt, userPrompt: customUserPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'suggest') {
      systemPrompt = `You are an expert architect and floor planning AI assistant. 
Analyze the user's requirements and provide 3-5 practical, actionable layout suggestions.
Consider:
- Optimal room placement and flow
- Natural lighting opportunities
- Space efficiency
- Building code compliance basics
- Accessibility

Provide specific, numbered suggestions that are implementable.`;

      userPrompt = `Floor Plan Details:
Title: ${planData?.title}
Type: ${planData?.project_type || 'Not specified'}
Area: ${planData?.area_sqm || 'Not specified'} m²

User Requirements:
${prompt}

Provide 3-5 specific layout suggestions:`;

    } else if (action === 'check') {
      systemPrompt = `You are an expert building code compliance checker and floor plan analyzer.
Review the floor plan and identify potential issues including:
- Room access and circulation problems
- Door swing conflicts
- Minimum room dimension violations
- Poor natural lighting
- Accessibility concerns
- Fire safety and egress issues

For each issue, provide:
1. Severity level (info/warning/critical)
2. Clear description
3. Specific suggestion to fix it`;

      userPrompt = `Analyze this floor plan for potential issues:
${JSON.stringify(canvasData)}

Identify and categorize any problems with the layout:`;
    } else if (action === 'architectural-analysis') {
      // Use custom prompts provided by the client for architectural analysis
      systemPrompt = customSystemPrompt || systemPrompt;
      userPrompt = customUserPrompt || userPrompt;
    } else if (action === 'optimize-layout') {
      // Use custom prompts for room layout optimization
      systemPrompt = customSystemPrompt || systemPrompt;
      userPrompt = customUserPrompt || userPrompt;
    } else if (action === 'code-check') {
      // Use custom prompts for building code compliance checking
      systemPrompt = customSystemPrompt || systemPrompt;
      userPrompt = customUserPrompt || userPrompt;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    if (action === 'suggest') {
      // Parse suggestions from AI response
      const suggestions = aiResponse
        .split('\n')
        .filter((line: string) => line.match(/^\d+\./))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'check') {
      // Parse issues from AI response
      const lines = aiResponse.split('\n');
      const issues = [];
      let currentIssue: any = null;

      for (const line of lines) {
        if (line.match(/^(CRITICAL|WARNING|INFO):/i)) {
          if (currentIssue) issues.push(currentIssue);
          const severity = line.match(/^(CRITICAL|WARNING|INFO):/i)?.[1].toLowerCase();
          currentIssue = {
            severity,
            title: line.replace(/^(CRITICAL|WARNING|INFO):/i, '').trim(),
            description: '',
            suggestion: ''
          };
        } else if (currentIssue && line.trim()) {
          if (line.toLowerCase().includes('suggestion:')) {
            currentIssue.suggestion = line.replace(/suggestion:/i, '').trim();
          } else {
            currentIssue.description += ' ' + line.trim();
          }
        }
      }
      if (currentIssue) issues.push(currentIssue);

      return new Response(
        JSON.stringify({ issues, suggestions: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'architectural-analysis') {
      return new Response(
        JSON.stringify({ report: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'optimize-layout' || action === 'code-check') {
      return new Response(
        JSON.stringify({ report: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in floor-plan-ai function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
