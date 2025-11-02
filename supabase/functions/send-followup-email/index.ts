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
    const { applicationId, emailType, customMessage } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Get application details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('id', applicationId)
      .single();

    if (appError) throw appError;

    const templates = {
      reminder: {
        subject: `Reminder: Complete Your Interview - ${application.jobs.title}`,
        html: `
          <h2>Interview Reminder</h2>
          <p>Hi ${application.candidate_name},</p>
          <p>This is a friendly reminder that you have a pending AI interview for the <strong>${application.jobs.title}</strong> position.</p>
          <p>Please complete your interview at your earliest convenience.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p><a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/ai-interview/${applicationId}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Interview</a></p>
        `
      },
      accepted: {
        subject: `Congratulations! Next Steps - ${application.jobs.title}`,
        html: `
          <h2>Great News!</h2>
          <p>Dear ${application.candidate_name},</p>
          <p>We're pleased to inform you that you've successfully passed the AI screening for the <strong>${application.jobs.title}</strong> position.</p>
          <p>We'd like to invite you to the next round of interviews with our team.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>We'll be in touch shortly with more details.</p>
          <p>Best regards,<br>The Recruitment Team</p>
        `
      },
      rejected: {
        subject: `Application Update - ${application.jobs.title}`,
        html: `
          <h2>Application Update</h2>
          <p>Dear ${application.candidate_name},</p>
          <p>Thank you for your interest in the <strong>${application.jobs.title}</strong> position and for taking the time to complete the interview process.</p>
          <p>After careful consideration, we've decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>We appreciate your interest in joining our team and wish you all the best in your job search.</p>
          <p>Best regards,<br>The Recruitment Team</p>
        `
      },
      custom: {
        subject: `Update on Your Application - ${application.jobs.title}`,
        html: `
          <h2>Application Update</h2>
          <p>Hi ${application.candidate_name},</p>
          ${customMessage ? `<p>${customMessage}</p>` : '<p>We wanted to reach out regarding your application.</p>'}
          <p>Best regards,<br>The Recruitment Team</p>
        `
      }
    };

    const template = templates[emailType as keyof typeof templates] || templates.custom;

    await resend.emails.send({
      from: 'Recruitment <onboarding@resend.dev>',
      to: [application.candidate_email],
      subject: template.subject,
      html: template.html,
    });

    console.log(`${emailType} email sent to ${application.candidate_email}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-followup-email:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
