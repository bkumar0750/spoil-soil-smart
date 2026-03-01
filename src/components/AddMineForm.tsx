import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle, AlertTriangle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { parseCSV, validateCSV, type TrainingRow, type ValidationResult } from "@/lib/csv-validator";

interface AddMineFormProps {
  onBack: () => void;
  onComplete: (mineId: string) => void;
}

const AddMineForm = ({ onBack, onComplete }: AddMineFormProps) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mineType, setMineType] = useState("coal");
  const [csvData, setCsvData] = useState<TrainingRow[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setCsvData(parsed);
      const result = validateCSV(parsed);
      setValidation(result);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!name || csvData.length === 0 || !validation?.isValid) return;
    setSaving(true);

    try {
      // Create mine site
      const { data: mine, error: mineErr } = await supabase.from('mine_sites').insert({
        name,
        location: location || null,
        country: country || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        mine_type: mineType,
        dataset_status: 'validated',
        data_quality_score: validation.quality.score,
        total_records: csvData.length,
        completeness_pct: validation.quality.completeness,
        validation_report: validation as any,
      }).select('id').single();

      if (mineErr) throw mineErr;

      // Insert training data
      const rows = csvData.map(row => ({
        dataset_name: `${name}_dataset`,
        mine_site_id: mine.id,
        site_name: name,
        date: row.date,
        lst: row.lst,
        ndvi: row.ndvi,
        rainfall: row.rainfall,
        slope: row.slope,
        soil_moisture: row.soil_moisture,
        twi: row.twi,
      }));

      const { error: insertErr } = await supabase.from('training_data').insert(rows);
      if (insertErr) throw insertErr;

      toast({ title: "Mine Site Added", description: `${name} with ${csvData.length} records saved successfully.` });
      onComplete(mine.id);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Mine Sites
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add New Mine Site</CardTitle>
          <CardDescription>Enter mine details and upload your training CSV dataset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mine Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Mine Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Noamundi Iron Mine" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Jharkhand, India" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. India" />
            </div>
            <div className="space-y-2">
              <Label>Mine Type</Label>
              <Select value={mineType} onValueChange={setMineType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="coal">Coal</SelectItem>
                  <SelectItem value="iron">Iron Ore</SelectItem>
                  <SelectItem value="copper">Copper</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input type="number" step="0.0001" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="e.g. 22.1564" />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input type="number" step="0.0001" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="e.g. 85.5184" />
            </div>
          </div>

          {/* CSV Upload */}
          <div className="space-y-3">
            <Label>Training Data CSV *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <label className="cursor-pointer">
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">{fileName || 'Click to upload CSV'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Required columns: Date, LST, NDVI, Rainfall, Slope, Soil_Moisture, TWI
                </p>
              </label>
            </div>
          </div>

          {/* Validation Results */}
          {validation && (
            <Card className={`border-2 ${validation.isValid ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <CardTitle className="text-lg">
                      Data Quality: {validation.quality.grade}
                    </CardTitle>
                  </div>
                  <Badge variant={validation.quality.score >= 65 ? 'default' : 'destructive'}>
                    Score: {validation.quality.score}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={validation.quality.score} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
                  <div className="p-2 rounded bg-background">
                    <p className="font-bold">{validation.quality.totalRows}</p>
                    <p className="text-xs text-muted-foreground">Total Rows</p>
                  </div>
                  <div className="p-2 rounded bg-background">
                    <p className="font-bold">{validation.quality.completeness}%</p>
                    <p className="text-xs text-muted-foreground">Completeness</p>
                  </div>
                  <div className="p-2 rounded bg-background">
                    <p className="font-bold">{validation.quality.withSmCount}</p>
                    <p className="text-xs text-muted-foreground">With SM</p>
                  </div>
                  <div className="p-2 rounded bg-background">
                    <p className="font-bold">{validation.quality.outlierCount}</p>
                    <p className="text-xs text-muted-foreground">Outliers</p>
                  </div>
                </div>

                {/* Column Report */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Column Validation</p>
                  <div className="grid gap-1">
                    {Object.entries(validation.columnReport).map(([col, report]) => (
                      <div key={col} className="flex items-center justify-between text-xs p-2 rounded bg-background">
                        <span className="font-mono">{col}</span>
                        <div className="flex items-center gap-2">
                          {report.present ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-destructive" />
                          )}
                          {report.min != null && <span>Range: {report.min.toFixed(2)}–{report.max?.toFixed(2)}</span>}
                          {report.nullCount > 0 && <Badge variant="outline" className="text-[10px] px-1">{report.nullCount} null</Badge>}
                          {report.outOfRange > 0 && <Badge variant="destructive" className="text-[10px] px-1">{report.outOfRange} outliers</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Errors & Warnings */}
                {validation.errors.length > 0 && (
                  <div className="space-y-1">
                    {validation.errors.map((e, i) => (
                      <p key={i} className="text-xs text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {e}
                      </p>
                    ))}
                  </div>
                )}
                {validation.warnings.length > 0 && (
                  <div className="space-y-1">
                    {validation.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {w}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!name || csvData.length === 0 || !validation?.isValid || saving}
            className="w-full"
            size="lg"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <>Save Mine Site & Training Data</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMineForm;
