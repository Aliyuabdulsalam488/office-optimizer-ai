import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "on-leave" | "inactive";
  startDate: string;
  manager: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "active",
    startDate: "2022-03-15",
    manager: "Sarah Johnson",
  },
  {
    id: "2",
    name: "Emily Davis",
    position: "Marketing Manager",
    department: "Marketing",
    email: "emily.davis@company.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    status: "active",
    startDate: "2021-06-01",
    manager: "Michael Brown",
  },
  {
    id: "3",
    name: "Robert Wilson",
    position: "Sales Representative",
    department: "Sales",
    email: "robert.wilson@company.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    status: "on-leave",
    startDate: "2023-01-10",
    manager: "Lisa Anderson",
  },
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "on-leave": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "inactive": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted";
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === "active").length,
    onLeave: employees.filter(e => e.status === "on-leave").length,
    departments: new Set(employees.map(e => e.department)).size,
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h3 className="text-xl font-bold">Employee Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">{stats.active}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">On Leave</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.onLeave}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Departments</p>
          <p className="text-2xl font-bold">{stats.departments}</p>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="on-leave">On Leave</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Manager: <span className="font-medium text-foreground">{employee.manager}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Profile</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active">
          <p className="text-sm text-muted-foreground text-center py-8">
            {employees.filter(e => e.status === "active").length} active employees
          </p>
        </TabsContent>

        <TabsContent value="on-leave">
          <p className="text-sm text-muted-foreground text-center py-8">
            {employees.filter(e => e.status === "on-leave").length} employees on leave
          </p>
        </TabsContent>

        <TabsContent value="departments">
          <p className="text-sm text-muted-foreground text-center py-8">
            Department breakdown view
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmployeeManagement;
