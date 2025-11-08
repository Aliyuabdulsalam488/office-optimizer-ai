import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", employees: 230, newHires: 12, attrition: 5 },
  { month: "Feb", employees: 237, newHires: 15, attrition: 8 },
  { month: "Mar", employees: 244, newHires: 18, attrition: 11 },
  { month: "Apr", employees: 251, newHires: 14, attrition: 7 },
  { month: "May", employees: 258, newHires: 16, attrition: 9 },
  { month: "Jun", employees: 265, newHires: 18, attrition: 11 },
];

export const HRMetricsChart = () => {
  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="font-semibold text-lg mb-6">HR Metrics Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="employees" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            animationDuration={1000}
          />
          <Line 
            type="monotone" 
            dataKey="newHires" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--success))", r: 4 }}
            animationDuration={1000}
          />
          <Line 
            type="monotone" 
            dataKey="attrition" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--destructive))", r: 4 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
