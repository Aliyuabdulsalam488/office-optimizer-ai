import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import RecruitmentTracking from "@/components/hr/RecruitmentTracking";

const Recruitment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Recruitment Management
          </h1>
          <p className="text-muted-foreground">
            Manage job postings, applications, and interviews
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs" className="p-6">
              <RecruitmentTracking view="jobs" />
            </TabsContent>
            
            <TabsContent value="applications" className="p-6">
              <RecruitmentTracking view="applications" />
            </TabsContent>
            
            <TabsContent value="interviews" className="p-6">
              <RecruitmentTracking view="interviews" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Recruitment;