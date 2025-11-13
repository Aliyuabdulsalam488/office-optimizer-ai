import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Palette, Ruler, DollarSign, CheckCircle } from "lucide-react";

interface Material {
  id: string;
  name: string;
  category: string;
  finish: string;
  pricePerSqFt: number;
  color: string;
  durability: string;
  maintenance: string;
}

export const MaterialLibrary = () => {
  const { toast } = useToast();
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const materials: Material[] = [
    // Flooring
    { id: "f1", name: "Oak Hardwood", category: "flooring", finish: "Natural", pricePerSqFt: 8.50, color: "#DEB887", durability: "High", maintenance: "Moderate" },
    { id: "f2", name: "Porcelain Tile", category: "flooring", finish: "Glazed", pricePerSqFt: 6.00, color: "#E5E5E5", durability: "Very High", maintenance: "Low" },
    { id: "f3", name: "Luxury Vinyl", category: "flooring", finish: "Textured", pricePerSqFt: 4.50, color: "#8B7355", durability: "High", maintenance: "Very Low" },
    { id: "f4", name: "Marble Tile", category: "flooring", finish: "Polished", pricePerSqFt: 15.00, color: "#F5F5F5", durability: "Moderate", maintenance: "High" },
    
    // Wall Materials
    { id: "w1", name: "Drywall Paint", category: "wall", finish: "Matte", pricePerSqFt: 0.50, color: "#FFFFFF", durability: "Moderate", maintenance: "Low" },
    { id: "w2", name: "Subway Tile", category: "wall", finish: "Glossy", pricePerSqFt: 5.00, color: "#F8F8F8", durability: "High", maintenance: "Low" },
    { id: "w3", name: "Brick Veneer", category: "wall", finish: "Natural", pricePerSqFt: 8.00, color: "#B22222", durability: "Very High", maintenance: "Very Low" },
    { id: "w4", name: "Wood Paneling", category: "wall", finish: "Stained", pricePerSqFt: 7.50, color: "#8B4513", durability: "High", maintenance: "Moderate" },

    // Countertops
    { id: "c1", name: "Granite", category: "countertop", finish: "Polished", pricePerSqFt: 60.00, color: "#696969", durability: "Very High", maintenance: "Low" },
    { id: "c2", name: "Quartz", category: "countertop", finish: "Polished", pricePerSqFt: 75.00, color: "#DCDCDC", durability: "Very High", maintenance: "Very Low" },
    { id: "c3", name: "Butcher Block", category: "countertop", finish: "Oiled", pricePerSqFt: 40.00, color: "#D2691E", durability: "Moderate", maintenance: "High" },
    { id: "c4", name: "Laminate", category: "countertop", finish: "Smooth", pricePerSqFt: 25.00, color: "#A9A9A9", durability: "Moderate", maintenance: "Low" },

    // Ceiling
    { id: "ce1", name: "Standard Drywall", category: "ceiling", finish: "Smooth", pricePerSqFt: 1.50, color: "#FFFFFF", durability: "Moderate", maintenance: "Low" },
    { id: "ce2", name: "Coffered Ceiling", category: "ceiling", finish: "Painted", pricePerSqFt: 12.00, color: "#F5F5DC", durability: "High", maintenance: "Low" },
    { id: "ce3", name: "Acoustic Tile", category: "ceiling", finish: "Textured", pricePerSqFt: 3.50, color: "#E0E0E0", durability: "Moderate", maintenance: "Very Low" },
  ];

  const categories = [
    { value: "flooring", label: "Flooring", icon: Ruler },
    { value: "wall", label: "Wall Finishes", icon: Palette },
    { value: "countertop", label: "Countertops", icon: DollarSign },
    { value: "ceiling", label: "Ceiling", icon: Palette },
  ];

  const filteredMaterials = (category: string) => {
    return materials.filter(m => 
      m.category === category && 
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const calculateTotalCost = () => {
    const selected = materials.filter(m => selectedMaterials.includes(m.id));
    return selected.reduce((sum, m) => sum + m.pricePerSqFt, 0);
  };

  const exportSelection = () => {
    const selected = materials.filter(m => selectedMaterials.includes(m.id));
    const exportData = {
      materials: selected,
      totalEstimate: calculateTotalCost(),
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'material-selection.json';
    a.click();
    
    toast({
      title: "Materials Exported",
      description: "Your material selection has been downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Material Library</h3>
            <p className="text-sm text-muted-foreground">
              Browse and select materials for your floor plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Selected Materials</p>
            <p className="text-2xl font-bold text-primary">{selectedMaterials.length}</p>
          </div>
        </div>

        <Input
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6"
        />

        <Tabs defaultValue="flooring" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.value} value={cat.value}>
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="space-y-4 mt-6">
              {filteredMaterials(cat.value).map((material) => (
                <Card
                  key={material.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedMaterials.includes(material.id)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleMaterial(material.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div
                        className="w-16 h-16 rounded-lg border-2"
                        style={{ backgroundColor: material.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{material.name}</h4>
                          {selectedMaterials.includes(material.id) && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">{material.finish}</Badge>
                          <Badge variant="outline">Durability: {material.durability}</Badge>
                          <Badge variant="outline">Maintenance: {material.maintenance}</Badge>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          ${material.pricePerSqFt.toFixed(2)} / sq ft
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {selectedMaterials.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Selected Materials Summary</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMaterials.length} materials selected
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Base Cost Estimate</p>
              <p className="text-2xl font-bold text-primary">
                ${calculateTotalCost().toFixed(2)} / sq ft
              </p>
            </div>
          </div>
          <Button onClick={exportSelection} className="w-full">
            Export Material Selection
          </Button>
        </Card>
      )}
    </div>
  );
};
