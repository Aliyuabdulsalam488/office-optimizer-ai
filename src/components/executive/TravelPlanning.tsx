import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, Car, Calendar, MapPin, Clock, DollarSign, Plus } from "lucide-react";

interface Trip {
  id: string;
  destination: string;
  dates: string;
  purpose: string;
  status: "upcoming" | "current" | "completed";
  flight?: {
    departure: string;
    arrival: string;
    airline: string;
    flightNumber: string;
  };
  hotel?: {
    name: string;
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  totalCost: number;
}

const mockTrips: Trip[] = [
  {
    id: "1",
    destination: "San Francisco, CA",
    dates: "Oct 20-22, 2025",
    purpose: "Tech Conference",
    status: "upcoming",
    flight: {
      departure: "JFK 8:00 AM",
      arrival: "SFO 11:30 AM",
      airline: "United Airlines",
      flightNumber: "UA 1234",
    },
    hotel: {
      name: "Hyatt Regency San Francisco",
      checkIn: "Oct 20, 3:00 PM",
      checkOut: "Oct 22, 12:00 PM",
      nights: 2,
    },
    totalCost: 2450,
  },
  {
    id: "2",
    destination: "London, UK",
    dates: "Nov 5-10, 2025",
    purpose: "Client Meetings",
    status: "upcoming",
    flight: {
      departure: "JFK 6:00 PM",
      arrival: "LHR 6:00 AM+1",
      airline: "British Airways",
      flightNumber: "BA 178",
    },
    hotel: {
      name: "The Savoy",
      checkIn: "Nov 5, 2:00 PM",
      checkOut: "Nov 10, 11:00 AM",
      nights: 5,
    },
    totalCost: 5890,
  },
];

const TravelPlanning = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "current": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5" />
          <h3 className="text-xl font-bold">Travel Planning</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Plan New Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Upcoming Trips</p>
          <p className="text-2xl font-bold text-blue-500">{mockTrips.filter(t => t.status === "upcoming").length}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Days Traveling</p>
          <p className="text-2xl font-bold">15</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
          <p className="text-2xl font-bold">${mockTrips.reduce((sum, t) => sum + t.totalCost, 0).toLocaleString()}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Countries</p>
          <p className="text-2xl font-bold">3</p>
        </Card>
      </div>

      <div className="space-y-4">
        {mockTrips.map((trip) => (
          <Card key={trip.id} className="p-5 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold mb-1">{trip.destination}</h4>
                <p className="text-sm text-muted-foreground">{trip.purpose}</p>
              </div>
              <Badge className={getStatusColor(trip.status)}>
                {trip.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{trip.dates}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>${trip.totalCost.toLocaleString()} total</span>
              </div>
            </div>

            {trip.flight && (
              <Card className="p-4 bg-background/50 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Flight Details</p>
                    <p className="text-xs text-muted-foreground">{trip.flight.airline} - {trip.flight.flightNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Departure</p>
                    <p className="font-medium">{trip.flight.departure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Arrival</p>
                    <p className="font-medium">{trip.flight.arrival}</p>
                  </div>
                </div>
              </Card>
            )}

            {trip.hotel && (
              <Card className="p-4 bg-background/50 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                    <Hotel className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{trip.hotel.name}</p>
                    <p className="text-xs text-muted-foreground">{trip.hotel.nights} nights</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in</p>
                    <p className="font-medium">{trip.hotel.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out</p>
                    <p className="font-medium">{trip.hotel.checkOut}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <MapPin className="w-4 h-4 mr-2" />
                View Itinerary
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Car className="w-4 h-4 mr-2" />
                Transportation
              </Button>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Travel Tips
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• San Francisco trip: Don't forget to check in 24 hours before departure</li>
          <li>• London trip: Consider applying for Global Entry for faster customs</li>
          <li>• Remember to notify your credit card company of international travel</li>
        </ul>
      </div>
    </Card>
  );
};

export default TravelPlanning;
