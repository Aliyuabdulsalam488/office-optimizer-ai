import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

const SalesForecasting = () => {
  const currentMonth = {
    target: 500000,
    actual: 387000,
    forecast: 485000,
    lastYear: 420000,
  };

  const quarterData = [
    { month: "October", target: 500000, forecast: 485000, actual: 387000 },
    { month: "November", target: 520000, forecast: 510000, actual: 0 },
    { month: "December", target: 550000, forecast: 540000, actual: 0 },
  ];

  const teamForecasts = [
    { rep: "Sarah Johnson", quota: 120000, pipeline: 145000, forecast: 138000, attainment: 115 },
    { rep: "John Smith", quota: 100000, pipeline: 98000, forecast: 95000, attainment: 95 },
    { rep: "Mike Davis", quota: 110000, pipeline: 125000, forecast: 118000, attainment: 107 },
    { rep: "Lisa Anderson", quota: 95000, pipeline: 102000, forecast: 98000, attainment: 103 },
  ];

  const getAttainmentColor = (attainment: number) => {
    if (attainment >= 100) return "text-green-500";
    if (attainment >= 80) return "text-yellow-500";
    return "text-red-500";
  };

  const progress = (currentMonth.actual / currentMonth.target) * 100;
  const vsLastYear = ((currentMonth.actual - currentMonth.lastYear) / currentMonth.lastYear) * 100;

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-xl font-bold">Sales Forecasting</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            <Badge variant="outline">Target</Badge>
          </div>
          <p className="text-2xl font-bold">${(currentMonth.target / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground">Monthly Target</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            {vsLastYear >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="text-2xl font-bold">${(currentMonth.actual / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground">
            Actual <span className={vsLastYear >= 0 ? "text-green-500" : "text-red-500"}>
              ({vsLastYear >= 0 ? "+" : ""}{vsLastYear.toFixed(1)}% YoY)
            </span>
          </p>
        </Card>
        <Card className="p-4 bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <Badge variant="outline" className="text-green-500">Forecast</Badge>
          </div>
          <p className="text-2xl font-bold text-green-500">${(currentMonth.forecast / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground">Projected Close</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{progress.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">Target Attainment</p>
          <Progress value={progress} className="h-1 mt-2" />
        </Card>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-4">Q4 2025 Forecast</h4>
        <div className="space-y-3">
          {quarterData.map((month, index) => (
            <Card key={index} className="p-4 bg-background/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{month.month}</span>
                <Badge variant="outline">
                  {month.actual > 0 ? `${((month.actual / month.target) * 100).toFixed(0)}%` : "Pending"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="font-semibold">${(month.target / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Forecast</p>
                  <p className="font-semibold text-green-500">${(month.forecast / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actual</p>
                  <p className="font-semibold">
                    {month.actual > 0 ? `$${(month.actual / 1000).toFixed(0)}K` : "-"}
                  </p>
                </div>
              </div>
              <Progress 
                value={month.actual > 0 ? (month.actual / month.target) * 100 : (month.forecast / month.target) * 100} 
                className="h-2 mt-3" 
              />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-4">Team Performance Forecast</h4>
        <div className="space-y-3">
          {teamForecasts.map((rep, index) => (
            <Card key={index} className="p-4 bg-background/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold">{rep.rep}</h5>
                  <p className="text-sm text-muted-foreground">Quota: ${rep.quota.toLocaleString()}</p>
                </div>
                <Badge className={`${getAttainmentColor(rep.attainment)} bg-opacity-10`}>
                  {rep.attainment}% attainment
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Pipeline</p>
                  <p className="font-semibold">${(rep.pipeline / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Forecast</p>
                  <p className="font-semibold text-green-500">${(rep.forecast / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">vs Quota</p>
                  <p className={`font-semibold ${getAttainmentColor(rep.attainment)}`}>
                    {rep.attainment >= 100 ? "+" : ""}{rep.attainment - 100}%
                  </p>
                </div>
              </div>
              <Progress value={rep.attainment} className="h-2" />
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Forecast Insight</h4>
            <p className="text-sm text-muted-foreground">
              Team is tracking at 97% of target for the month. Strong pipeline coverage of 1.2x suggests high confidence in hitting Q4 targets. Sarah Johnson and Mike Davis are forecasted to exceed quota.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalesForecasting;
