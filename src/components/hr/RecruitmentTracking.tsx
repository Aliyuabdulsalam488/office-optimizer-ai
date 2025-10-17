import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Plus, Star, Clock, CheckCircle, XCircle, Mic } from "lucide-react";
import AIVoiceInterview from "./AIVoiceInterview";

interface Candidate {
  id: string;
  name: string;
  position: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  rating: number;
  appliedDate: string;
  email: string;
  experience: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Thompson",
    position: "Senior Software Engineer",
    stage: "interview",
    rating: 4.5,
    appliedDate: "2025-10-10",
    email: "alex.t@email.com",
    experience: "8 years",
  },
  {
    id: "2",
    name: "Maria Garcia",
    position: "Product Manager",
    stage: "offer",
    rating: 4.8,
    appliedDate: "2025-10-08",
    email: "maria.g@email.com",
    experience: "6 years",
  },
  {
    id: "3",
    name: "James Lee",
    position: "UX Designer",
    stage: "screening",
    rating: 4.2,
    appliedDate: "2025-10-12",
    email: "james.l@email.com",
    experience: "4 years",
  },
];

const RecruitmentTracking = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [showAIInterview, setShowAIInterview] = useState(false);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "applied": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "screening": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "interview": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "offer": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "hired": return "bg-green-600/10 text-green-600 border-green-600/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "interview": return <Clock className="w-4 h-4" />;
      case "offer": return <CheckCircle className="w-4 h-4" />;
      case "hired": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const stats = {
    total: candidates.length,
    interview: candidates.filter(c => c.stage === "interview").length,
    offer: candidates.filter(c => c.stage === "offer").length,
    hired: candidates.filter(c => c.stage === "hired").length,
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          <h3 className="text-xl font-bold">Recruitment Tracking</h3>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAIInterview(true)} variant="outline">
            <Mic className="w-4 h-4 mr-2" />
            AI Voice Interview
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active Candidates</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">In Interview</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.interview}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Offers Sent</p>
          <p className="text-2xl font-bold text-green-500">{stats.offer}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Hired (This Month)</p>
          <p className="text-2xl font-bold text-green-600">{stats.hired}</p>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="screening">Screening</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="offer">Offer</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold mb-1">{candidate.name}</h4>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                </div>
                <Badge className={`${getStageColor(candidate.stage)} flex items-center gap-1`}>
                  {getStageIcon(candidate.stage)}
                  {candidate.stage}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <p className="text-sm font-semibold">{candidate.rating}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-semibold">{candidate.experience}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Applied</p>
                  <p className="text-sm font-semibold">{candidate.appliedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold truncate">{candidate.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Resume
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Schedule Interview
                </Button>
                <Button size="sm" variant="outline">
                  Move Stage
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="screening">
          <p className="text-sm text-muted-foreground text-center py-8">
            {candidates.filter(c => c.stage === "screening").length} candidates in screening
          </p>
        </TabsContent>

        <TabsContent value="interview">
          <p className="text-sm text-muted-foreground text-center py-8">
            {candidates.filter(c => c.stage === "interview").length} candidates in interview stage
          </p>
        </TabsContent>

        <TabsContent value="offer">
          <p className="text-sm text-muted-foreground text-center py-8">
            {candidates.filter(c => c.stage === "offer").length} offers pending
          </p>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Hiring pipeline visualization</p>
            {["applied", "screening", "interview", "offer", "hired"].map((stage) => {
              const count = candidates.filter(c => c.stage === stage).length;
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{stage}</span>
                    <span className="text-muted-foreground">{count} candidates</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${(count / candidates.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {showAIInterview && (
        <AIVoiceInterview onClose={() => setShowAIInterview(false)} />
      )}
    </Card>
  );
};

export default RecruitmentTracking;
