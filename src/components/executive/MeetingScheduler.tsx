import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Users, Calendar, Video, MapPin, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Attendee {
  id: string;
  name: string;
  email: string;
}

const MeetingScheduler = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: "1", name: "", email: "" }
  ]);
  const { toast } = useToast();

  const addAttendee = () => {
    setAttendees([
      ...attendees,
      { id: Date.now().toString(), name: "", email: "" }
    ]);
  };

  const removeAttendee = (id: string) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter(a => a.id !== id));
    }
  };

  const updateAttendee = (id: string, field: keyof Attendee, value: string) => {
    setAttendees(attendees.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleSchedule = () => {
    toast({
      title: "Meeting Scheduled",
      description: "Calendar invites have been sent to all attendees",
    });
  };

  const suggestedTimes = [
    { time: "Today, 3:00 PM", available: 4 },
    { time: "Tomorrow, 10:00 AM", available: 5 },
    { time: "Tomorrow, 2:30 PM", available: 5 },
    { time: "Oct 19, 9:00 AM", available: 3 },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5" />
        <h3 className="text-xl font-bold">Meeting Scheduler</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meeting-title">Meeting Title</Label>
          <Input
            id="meeting-title"
            placeholder="e.g., Q4 Strategy Review"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-type">Meeting Type</Label>
            <Select>
              <SelectTrigger id="meeting-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location / Meeting Link</Label>
          <div className="flex gap-2">
            <Input
              id="location"
              placeholder="Conference room or video link"
            />
            <Button type="button" variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Generate Zoom
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Attendees</Label>
            <Button type="button" size="sm" variant="outline" onClick={addAttendee}>
              <Plus className="w-4 h-4 mr-2" />
              Add Attendee
            </Button>
          </div>

          {attendees.map((attendee, index) => (
            <Card key={attendee.id} className="p-3 bg-background/50">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={attendee.name}
                    onChange={(e) => updateAttendee(attendee.id, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={attendee.email}
                    onChange={(e) => updateAttendee(attendee.id, "email", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeAttendee(attendee.id)}
                  disabled={attendees.length === 1}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agenda">Agenda / Description</Label>
          <Textarea
            id="agenda"
            placeholder="Meeting agenda and topics to discuss..."
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label>Options</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="calendar-reminder" />
              <label
                htmlFor="calendar-reminder"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send calendar reminders (15 mins before)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="recurring" />
              <label
                htmlFor="recurring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recurring meeting
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="record" />
              <label
                htmlFor="record"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable recording
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Suggested Time Slots (Based on availability)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {suggestedTimes.map((slot, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-between"
                size="sm"
              >
                <span>{slot.time}</span>
                <span className="text-xs text-green-500">{slot.available}/{attendees.length} available</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSchedule} className="flex-1 bg-gradient-primary">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button variant="outline">
            Save as Draft
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MeetingScheduler;
