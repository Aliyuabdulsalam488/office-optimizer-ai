import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Search, Plus, Receipt, CreditCard, Upload, TrendingUp } from "lucide-react";

interface Expense {
  id: string;
  date: string;
  category: string;
  merchant: string;
  amount: number;
  status: "pending" | "approved" | "reimbursed";
  receipt: boolean;
  project?: string;
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    date: "Oct 15, 2025",
    category: "Travel",
    merchant: "United Airlines",
    amount: 450,
    status: "pending",
    receipt: true,
    project: "San Francisco Trip",
  },
  {
    id: "2",
    date: "Oct 14, 2025",
    category: "Meals",
    merchant: "The Capital Grille",
    amount: 185,
    status: "approved",
    receipt: true,
    project: "Client Dinner",
  },
  {
    id: "3",
    date: "Oct 13, 2025",
    category: "Transportation",
    merchant: "Uber",
    amount: 45,
    status: "reimbursed",
    receipt: false,
  },
  {
    id: "4",
    date: "Oct 12, 2025",
    category: "Office Supplies",
    merchant: "Staples",
    amount: 120,
    status: "approved",
    receipt: true,
  },
];

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "approved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "reimbursed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "travel": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "meals": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "transportation": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "office supplies": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted";
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0),
    count: expenses.length,
  };

  const categoryBreakdown = [
    { category: "Travel", amount: 1250, percentage: 42 },
    { category: "Meals", amount: 850, percentage: 29 },
    { category: "Transportation", amount: 420, percentage: 14 },
    { category: "Office Supplies", amount: 450, percentage: 15 },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          <h3 className="text-xl font-bold">Expense Tracking</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-2xl font-bold">${stats.total.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">${stats.pending.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-500">${stats.approved.toFixed(2)}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Transactions</p>
          <p className="text-2xl font-bold">{stats.count}</p>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{expense.merchant}</h4>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${expense.amount.toFixed(2)}</p>
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <Badge className={getCategoryColor(expense.category)} variant="outline">
                    {expense.category}
                  </Badge>
                </div>
                {expense.project && (
                  <div>
                    <p className="text-xs text-muted-foreground">Project</p>
                    <p className="text-sm font-medium">{expense.project}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Receipt</p>
                  <p className="text-sm font-medium">
                    {expense.receipt ? "✓ Attached" : "✗ Missing"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Receipt
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                {expense.status === "pending" && (
                  <Button size="sm" variant="outline">
                    Submit
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          <p className="text-sm text-muted-foreground text-center py-8">
            {expenses.filter(e => e.status === "pending").length} pending expenses totaling ${stats.pending.toFixed(2)}
          </p>
        </TabsContent>

        <TabsContent value="approved">
          <p className="text-sm text-muted-foreground text-center py-8">
            {expenses.filter(e => e.status === "approved").length} approved expenses totaling ${stats.approved.toFixed(2)}
          </p>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-4">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Expenses by Category</h4>
            {categoryBreakdown.map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{cat.percentage}%</span>
                    <span className="font-semibold">${cat.amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Spending Insights</h4>
            <p className="text-sm text-muted-foreground">
              Your expenses this month are 15% lower than last month. Travel expenses are your largest category. Consider using corporate rate for hotels to save an additional 20%.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseTracking;
