import { Card } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { dimension: "Completeness", score: 87, fullMark: 100 },
  { dimension: "Accuracy", score: 92, fullMark: 100 },
  { dimension: "Consistency", score: 78, fullMark: 100 },
  { dimension: "Validity", score: 95, fullMark: 100 },
  { dimension: "Uniqueness", score: 89, fullMark: 100 },
  { dimension: "Timeliness", score: 84, fullMark: 100 },
];

export const DataQualityChart = () => {
  return (
    <Card className="p-6 animate-fade-in">
      <h3 className="font-semibold text-lg mb-6">Data Quality Dimensions</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="dimension" 
            stroke="hsl(var(--foreground))"
            fontSize={12}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
          />
          <Radar 
            name="Quality Score" 
            dataKey="score" 
            stroke="hsl(var(--primary))" 
            fill="hsl(var(--primary))" 
            fillOpacity={0.3}
            animationDuration={1000}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [`${value}%`, "Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};
