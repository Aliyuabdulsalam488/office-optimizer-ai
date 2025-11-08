import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RealtimeInterview } from '@/utils/RealtimeInterview';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AIVoiceInterviewProps {
  onClose?: () => void;
}

const AIVoiceInterview: React.FC<AIVoiceInterviewProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewNotes, setInterviewNotes] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const interviewRef = useRef<RealtimeInterview | null>(null);

  const handleMessage = (event: any) => {
    console.log('Interview event:', event);
    
    if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
    } else if (event.type === 'response.audio.done' || event.type === 'response.done') {
      setIsSpeaking(false);
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      console.log('Candidate said:', event.transcript);
    } else if (event.type === 'response.function_call_arguments.done') {
      if (event.name === 'save_interview_notes') {
        try {
          const args = JSON.parse(event.arguments);
          setInterviewNotes(prev => [...prev, `${args.rating ? `[${args.rating.toUpperCase()}] ` : ''}${args.notes}`]);
          toast({
            title: "Note Saved",
            description: "Interview observation recorded",
          });
        } catch (e) {
          console.error('Error parsing notes:', e);
        }
      }
    }
  };

  const startInterview = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      interviewRef.current = new RealtimeInterview(
        handleMessage,
        jobTitle,
        jobDescription
      );
      await interviewRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Interview Started",
        description: "The AI interviewer is ready. Start speaking!",
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start interview',
        variant: "destructive",
      });
    }
  };

  const endInterview = () => {
    interviewRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    
    toast({
      title: "Interview Ended",
      description: "Thank you for participating in the interview",
    });
  };

  useEffect(() => {
    return () => {
      interviewRef.current?.disconnect();
    };
  }, []);

  if (!isConfigured) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configure AI Voice Interview</CardTitle>
          <CardDescription>
            Set up the interview details before starting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Enter the key requirements and responsibilities..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsConfigured(true)} className="flex-1">
              Continue to Interview
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            AI Voice Interview - {jobTitle || 'Position'}
          </CardTitle>
          <CardDescription>
            {isConnected 
              ? "Interview in progress. Speak naturally and answer the questions."
              : "Click start to begin the AI-powered voice interview"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isSpeaking ? 'bg-primary animate-pulse' : 'bg-secondary'
              }`}>
                {isSpeaking ? (
                  <Mic className="w-16 h-16 text-primary-foreground" />
                ) : (
                  <MicOff className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted rounded-full text-xs">
                {isSpeaking ? 'AI Speaking...' : 'Listening...'}
              </div>
            </div>

            <div className="flex gap-4">
              {!isConnected ? (
                <Button 
                  onClick={startInterview}
                  size="lg"
                  className="gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Interview
                </Button>
              ) : (
                <Button 
                  onClick={endInterview}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <PhoneOff className="w-5 h-5" />
                  End Interview
                </Button>
              )}
              
              {onClose && (
                <Button onClick={onClose} variant="outline" size="lg">
                  Close
                </Button>
              )}
            </div>
          </div>

          {interviewNotes.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Interview Notes</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {interviewNotes.map((note, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Make sure your microphone is enabled</p>
            <p>• Speak clearly and at a normal pace</p>
            <p>• The AI will ask questions and wait for your responses</p>
            <p>• Interview notes are automatically recorded</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVoiceInterview;
