import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interviewId, transcript, responses } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Get interview and related data
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*, applications(*, jobs(*))')
      .eq('id', interviewId)
      .single();

    if (interviewError) throw interviewError;

    const job = interview.applications.jobs;
    const application = interview.applications;

    // Evaluate interview with AI
    const evaluationPrompt = `Evaluate this AI interview transcript and provide a detailed assessment.

Job Title: ${job.title}
Job Requirements: ${job.requirements}

Candidate: ${application.candidate_name}
Interview Transcript:
${transcript}

Candidate Responses:
${JSON.stringify(responses, null, 2)}

Provide:
1. Overall Score (0-100)
2. Strengths demonstrated
3. Areas of concern
4. Communication quality
5. Technical competency (if applicable)
6. Cultural fit assessment
7. Recommendation: STRONG_YES, YES, MAYBE, or NO
8. Reasoning for recommendation`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert HR interviewer evaluating candidate interviews. Be thorough and fair in your assessment.' },
          { role: 'user', content: evaluationPrompt }
        ],
      }),
    });

    const aiData = await aiResponse.json();
    const evaluation = aiData.choices[0].message.content;
    
    // Extract score
    const scoreMatch = evaluation.match(/(?:overall score|score)[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
    
    // Extract recommendation
    const recommendationMatch = evaluation.match(/recommendation[:\s]*(STRONG_YES|YES|MAYBE|NO)/i);
    const recommendation = recommendationMatch ? recommendationMatch[1] : 'MAYBE';

    // Update interview with evaluation
    await supabase
      .from('interviews')
      .update({
        ai_transcript: transcript,
        ai_evaluation: evaluation,
        ai_recommendation: recommendation,
        ai_score: score,
        status: 'completed'
      })
      .eq('id', interviewId);

    // Update application status
    const newStatus = ['STRONG_YES', 'YES'].includes(recommendation) 
      ? 'interview_passed' 
      : recommendation === 'MAYBE' 
      ? 'under_review' 
      : 'rejected';
    
    await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', application.id);

    // Get job owner email
    const { data: jobOwner } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', job.user_id)
      .single();

    // Send evaluation results to HR
    if (jobOwner?.email) {
      try {
        await resend.emails.send({
          from: 'Recruitment AI <onboarding@resend.dev>',
          to: [jobOwner.email],
          subject: `AI Interview Complete - ${application.candidate_name}`,
          html: `
            <h2>AI Interview Evaluation Complete</h2>
            
            <p><strong>Candidate:</strong> ${application.candidate_name}</p>
            <p><strong>Position:</strong> ${job.title}</p>
            <p><strong>AI Score:</strong> ${score}/100</p>
            <p><strong>Recommendation:</strong> ${recommendation}</p>
            
            <h3>Evaluation Summary:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; white-space: pre-wrap;">
${evaluation}
            </div>
            
            <p style="margin-top: 20px;">
              ${['STRONG_YES', 'YES'].includes(recommendation) 
                ? '✅ <strong>This candidate is recommended for the next round of interviews.</strong>' 
                : recommendation === 'MAYBE'
                ? '⚠️ <strong>This candidate requires further review.</strong>'
                : '❌ <strong>This candidate did not meet the requirements.</strong>'}
            </p>
            
            <p><a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/recruitment" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Dashboard</a></p>
          `,
        });
      } catch (emailError) {
        console.error('Error sending evaluation email:', emailError);
      }
    }

    console.log(`Interview ${interviewId} evaluated. Score: ${score}, Recommendation: ${recommendation}`);

    return new Response(JSON.stringify({ 
      success: true,
      score,
      recommendation,
      evaluation
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-interview-evaluator:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
