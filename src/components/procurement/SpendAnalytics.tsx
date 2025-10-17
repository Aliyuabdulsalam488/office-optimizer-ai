import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingDown, TrendingUp, DollarSign, Package } from "lucide-react";

const SpendAnalytics = () => {
  const metrics = [
    {
      label: "Total Spend (YTD)",
      value: "$1,245,890",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Cost Savings",
      value: "$87,340",
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
    },
    {
      label: "Active Suppliers",
      value: "147",
      change: "-3",
      trend: "down",
      icon: Package,
    },
    {
      label: "Avg. Order Value",
      value: "$8,456",
      change: "+5.7%",
      trend: "up",
      icon: BarChart3,
    },
  ];

  const categorySpend = [
    { category: "Raw Materials", amount: 456000, percentage: 37 },
    { category: "Components", amount: 312000, percentage: 25 },
    { category: "Equipment", amount: 248000, percentage: 20 },
    { category: "Services", amount: 156000, percentage: 13 },
    { category: "Office Supplies", amount: 73890, percentage: 5 },
  ];

  const topSuppliers = [
    { name: "ABC Manufacturing", spend: 203000, orders: 45 },
    { name: "Global Supplies Inc.", spend: 189000, orders: 62 },
    { name: "Premium Parts Ltd.", spend: 145000, orders: 38 },
    { name: "Tech Components Co.", spend: 128000, orders: 51 },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-xl font-bold">Spend Analytics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={index} className="p-4 bg-background/50">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <TrendIcon className={`w-4 h-4 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
              <span className={`text-xs ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {metric.change}
              </span>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold mb-4">Spend by Category</h4>
          <div className="space-y-3">
            {categorySpend.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-semibold">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Top Suppliers by Spend</h4>
          <div className="space-y-3">
            {topSuppliers.map((supplier, index) => (
              <Card key={index} className="p-3 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{supplier.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {supplier.orders} orders
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Spend</span>
                  <span className="text-sm font-bold">${supplier.spend.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Cost Savings Opportunities</h4>
            <p className="text-sm text-muted-foreground">
              AI analysis identified potential savings of $42,500 through supplier consolidation and bulk ordering in the Raw Materials category.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpendAnalytics;
