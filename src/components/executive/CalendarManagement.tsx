import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: "meeting" | "call" | "event" | "task";
  attendees?: number;
  location?: string;
  priority: "high" | "medium" | "low";
}

const todayEvents: Event[] = [
  {
    id: "1",
    title: "Executive Team Meeting",
    time: "09:00 AM",
    duration: "1 hour",
    type: "meeting",
    attendees: 8,
    location: "Conference Room A",
    priority: "high",
  },
  {
    id: "2",
    title: "Client Call - TechCorp",
    time: "11:00 AM",
    duration: "30 mins",
    type: "call",
    attendees: 3,
    priority: "high",
  },
  {
    id: "3",
    title: "Lunch with Board Member",
    time: "12:30 PM",
    duration: "1.5 hours",
    type: "event",
    location: "The Capital Grille",
    priority: "medium",
  },
  {
    id: "4",
    title: "Q4 Budget Review",
    time: "02:30 PM",
    duration: "1 hour",
    type: "meeting",
    attendees: 5,
    location: "Virtual - Zoom",
    priority: "high",
  },
  {
    id: "5",
    title: "Review Reports",
    time: "04:00 PM",
    duration: "45 mins",
    type: "task",
    priority: "medium",
  },
];

const upcomingDays = [
  { date: "Oct 18", events: 6 },
  { date: "Oct 19", events: 4 },
  { date: "Oct 20", events: 3 },
  { date: "Oct 21", events: 7 },
];

const CalendarManagement = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="w-4 h-4" />;
      case "call": return <Clock className="w-4 h-4" />;
      case "event": return <Calendar className="w-4 h-4" />;
      case "task": return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "call": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "event": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "task": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h3 className="text-xl font-bold">Calendar Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Today's Events</p>
          <p className="text-2xl font-bold">{todayEvents.length}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Meetings</p>
          <p className="text-2xl font-bold text-blue-500">
            {todayEvents.filter(e => e.type === "meeting").length}
          </p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Free Time</p>
          <p className="text-2xl font-bold text-green-500">2.5 hrs</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">This Week</p>
          <p className="text-2xl font-bold">24</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold">Today - October 17, 2025</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">Today</Button>
          <Button size="sm" variant="outline">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {todayEvents.map((event) => (
          <Card key={event.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start gap-3">
              <div className={`w-1 h-16 rounded-full ${getPriorityColor(event.priority)}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-semibold mb-1">{event.title}</h5>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <span>•</span>
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  <Badge className={getTypeColor(event.type)}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(event.type)}
                      {event.type}
                    </span>
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {event.attendees && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Join / View
                  </Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Reschedule</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4">Upcoming This Week</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {upcomingDays.map((day, index) => (
            <Card key={index} className="p-3 bg-background/50 text-center cursor-pointer hover:border-primary/50 transition-all">
              <p className="text-sm font-semibold mb-1">{day.date}</p>
              <p className="text-2xl font-bold text-primary">{day.events}</p>
              <p className="text-xs text-muted-foreground">events</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-semibold mb-2">Schedule Optimization</h4>
        <p className="text-sm text-muted-foreground">
          You have back-to-back meetings from 9 AM to 2:30 PM. Consider blocking 15-minute buffers between meetings. Your most productive hours (2-5 PM) are available for focused work.
        </p>
      </div>
    </Card>
  );
};

export default CalendarManagement;
