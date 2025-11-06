import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisData {
  location: any;
  timeRange: any;
  soilMoisture: any;
  vegetationIndices: any;
  soilProperties: any;
  growthPotential: any;
  dataQuality: any;
}

interface AreaAnalysisFormProps {
  onAnalysisComplete: (data: AnalysisData) => void;
  onDataRefresh?: () => void;
}

export const AreaAnalysisForm = ({ onAnalysisComplete, onDataRefresh }: AreaAnalysisFormProps) => {
  const [latitude, setLatitude] = useState("22.1564");
  const [longitude, setLongitude] = useState("85.5184");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-soil-moisture', {
        body: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          bufferSize: 1000,
        },
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Soil moisture and growth potential data retrieved successfully.",
      });

      onAnalysisComplete(data);
      
      // Trigger data refresh if callback provided
      if (onDataRefresh) {
        onDataRefresh();
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze area",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Analyze Mine Area</CardTitle>
            <CardDescription>Enter coordinates to analyze soil moisture and tree growth potential</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="22.1564"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="85.5184"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Default location: Noamundi Mine, Jharkhand, India
        </div>
        <Button onClick={handleAnalyze} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Analyze Area
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
