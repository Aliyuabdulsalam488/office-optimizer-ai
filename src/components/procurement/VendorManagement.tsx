import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, FileText, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VendorForm from "./VendorForm";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  status: string;
  performance_rating: number;
  tin: string;
  address: string;
}

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching vendors",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Vendor deleted",
        description: "Vendor has been removed successfully",
      });
      fetchVendors();
    } catch (error: any) {
      toast({
        title: "Error deleting vendor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedVendor(null);
    fetchVendors();
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vendor Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading vendors...</div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No vendors found. Click "Add Vendor" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{vendor.name}</h3>
                          <Badge className={getStatusColor(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-medium">{vendor.category || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{vendor.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{vendor.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">TIN</p>
                            <p className="font-medium">{vendor.tin || "N/A"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Performance Rating</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < vendor.performance_rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(vendor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(vendor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          </DialogHeader>
          <VendorForm vendor={selectedVendor} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorManagement;