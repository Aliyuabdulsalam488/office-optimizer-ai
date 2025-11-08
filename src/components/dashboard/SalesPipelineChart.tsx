import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { stage: "Prospecting", deals: 45, value: 230000 },
  { stage: "Qualification", deals: 32, value: 180000 },
  { stage: "Proposal", deals: 18, value: 120000 },
  { stage: "Negotiation", deals: 12, value: 85000 },
  { stage: "Closed Won", deals: 8, value: 95000 },
];

export const SalesPipelineChart = () => {
  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="font-semibold text-lg mb-6">Sales Pipeline Stages</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="stage" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
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
            formatter={(value: number, name: string) => {
              if (name === "value") return [`$${value.toLocaleString()}`, "Deal Value"];
              return [value, "Deals"];
            }}
          />
          <Legend />
          <Bar 
            dataKey="deals" 
            fill="hsl(var(--primary))" 
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
          />
          <Bar 
            dataKey="value" 
            fill="hsl(var(--secondary))" 
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
