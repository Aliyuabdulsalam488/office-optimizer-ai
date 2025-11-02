import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, topCandidates = 5 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Get all applications for this job
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('status', 'pending');

    if (appsError) throw appsError;

    console.log(`Analyzing ${applications?.length || 0} applications for job: ${job.title}`);

    // Analyze each application with AI
    const analyzedApps = [];
    
    for (const app of applications || []) {
      const prompt = `Analyze this job application and provide a match score (0-100) and detailed analysis.

Job Title: ${job.title}
Job Description: ${job.description}
Requirements: ${job.requirements}

Candidate: ${app.candidate_name}
Email: ${app.candidate_email}
Cover Letter: ${app.cover_letter || 'Not provided'}

Provide:
1. Match Score (0-100)
2. Analysis of strengths
3. Analysis of potential concerns
4. Overall recommendation`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are an expert HR recruiter analyzing job applications. Provide detailed, constructive feedback.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      const aiData = await aiResponse.json();
      const analysis = aiData.choices[0].message.content;
      
      // Extract score from analysis
      const scoreMatch = analysis.match(/(?:match score|score)[:\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

      // Update application with AI analysis
      await supabase
        .from('applications')
        .update({
          ai_match_score: score,
          ai_analysis: analysis,
          ai_analysis_date: new Date().toISOString(),
        })
        .eq('id', app.id);

      analyzedApps.push({
        ...app,
        ai_match_score: score,
        ai_analysis: analysis
      });
    }

    // Sort by score and get top candidates
    const topMatches = analyzedApps
      .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
      .slice(0, topCandidates);

    console.log(`Analysis complete. Top ${topCandidates} candidates identified.`);

    return new Response(JSON.stringify({ 
      success: true,
      totalAnalyzed: analyzedApps.length,
      topCandidates: topMatches 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-cv-analyzer:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
