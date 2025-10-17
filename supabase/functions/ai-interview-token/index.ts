import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { jobTitle, jobDescription } = await req.json();

    const systemPrompt = `You are an AI recruiter conducting a professional job interview for the position of ${jobTitle || 'the open position'}.

Job Description: ${jobDescription || 'Not provided'}

Your role:
- Greet the candidate warmly and introduce yourself
- Ask relevant questions about their experience, skills, and qualifications
- Listen carefully to their answers and ask follow-up questions
- Assess their fit for the role based on their responses
- Take notes on key points (you'll use the save_interview_notes tool)
- Conclude professionally and let them know next steps

Keep the interview conversational, professional, and engaging. Ask one question at a time and wait for responses.`;

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "sage",
        instructions: systemPrompt,
        tools: [
          {
            type: "function",
            name: "save_interview_notes",
            description: "Save important notes and observations about the candidate during the interview",
            parameters: {
              type: "object",
              properties: {
                notes: { 
                  type: "string",
                  description: "Key observations, strengths, concerns, or notable responses from the candidate"
                },
                rating: {
                  type: "string",
                  enum: ["excellent", "good", "average", "below_average"],
                  description: "Overall impression of the candidate's response"
                }
              },
              required: ["notes"]
            }
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error(`Failed to create session: ${error}`);
    }

    const data = await response.json();
    console.log("Session created successfully:", data.id);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
