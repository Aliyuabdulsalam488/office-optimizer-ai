import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { applicationIds, interviewDeadline } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    const scheduledInterviews = [];

    for (const appId of applicationIds) {
      // Get application details
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*, jobs(*)')
        .eq('id', appId)
        .single();

      if (appError) {
        console.error(`Error fetching application ${appId}:`, appError);
        continue;
      }

      // Create interview record
      const { data: interview, error: interviewError } = await supabase
        .from('interviews')
        .insert({
          application_id: appId,
          interview_type: 'AI Screening',
          interview_date: interviewDeadline,
          status: 'scheduled',
          notes: 'Automated AI interview scheduled',
          meeting_link: `${supabaseUrl.replace('supabase.co', 'lovable.app')}/ai-interview/${appId}`
        })
        .select()
        .single();

      if (interviewError) {
        console.error(`Error creating interview for ${appId}:`, interviewError);
        continue;
      }

      // Update application status
      await supabase
        .from('applications')
        .update({ status: 'interview_scheduled' })
        .eq('id', appId);

      // Send email invitation
      try {
        await resend.emails.send({
          from: 'Recruitment <onboarding@resend.dev>',
          to: [application.candidate_email],
          subject: `Interview Invitation - ${application.jobs.title}`,
          html: `
            <h2>Congratulations, ${application.candidate_name}!</h2>
            <p>You've been selected for an AI-powered interview for the position of <strong>${application.jobs.title}</strong>.</p>
            
            <p><strong>Interview Details:</strong></p>
            <ul>
              <li>Type: AI Screening Interview</li>
              <li>Deadline: ${new Date(interviewDeadline).toLocaleString()}</li>
              <li>Duration: Approximately 15-20 minutes</li>
            </ul>
            
            <p>Please complete your interview by clicking the link below:</p>
            <p><a href="${interview.meeting_link}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start AI Interview</a></p>
            
            <p>The AI interviewer will ask you questions about your experience and qualifications. Speak clearly and take your time to answer.</p>
            
            <p>Good luck!</p>
            <p>The Recruitment Team</p>
          `,
        });
        
        console.log(`Interview invitation sent to ${application.candidate_email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${application.candidate_email}:`, emailError);
      }

      scheduledInterviews.push(interview);
    }

    return new Response(JSON.stringify({ 
      success: true,
      scheduledCount: scheduledInterviews.length,
      interviews: scheduledInterviews
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-interview-scheduler:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
