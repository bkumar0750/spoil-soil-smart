import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Database, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MineSite {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  mine_type: string | null;
  dataset_status: string;
  data_quality_score: number | null;
  total_records: number;
  completeness_pct: number | null;
  created_at: string;
}

interface MineSelectorProps {
  onAddNew: () => void;
}

const gradeColor = (score: number | null) => {
  if (!score) return "secondary";
  if (score >= 80) return "default";
  if (score >= 50) return "secondary";
  return "destructive";
};

const MineSelector = ({ onAddNew }: MineSelectorProps) => {
  const [mines, setMines] = useState<MineSite[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadMines();
  }, []);

  const loadMines = async () => {
    const { data } = await supabase.from('mine_sites').select('*').order('created_at', { ascending: false });
    if (data) setMines(data as MineSite[]);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('training_data').delete().eq('mine_site_id', id);
    await supabase.from('mine_sites').delete().eq('id', id);
    loadMines();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mine Sites</h2>
          <p className="text-muted-foreground">Select a mine to view training data or add a new site</p>
        </div>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mine Site
        </Button>
      </div>

      {/* Pre-loaded Jharia */}
      <Card 
        className="cursor-pointer hover:border-primary/50 transition-colors border-2 border-primary/20"
        onClick={() => navigate('/model/jharia')}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Jharia Coalfield</CardTitle>
                <CardDescription>Jharkhand, India • Coal Mine</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Pre-loaded</Badge>
              <Badge variant="default">Grade A</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div className="p-2 rounded bg-muted/50">
              <p className="font-bold">120</p>
              <p className="text-xs text-muted-foreground">Records</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <p className="font-bold">2015–2024</p>
              <p className="text-xs text-muted-foreground">Period</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <p className="font-bold">72</p>
              <p className="text-xs text-muted-foreground">Training Samples</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <p className="font-bold">48</p>
              <p className="text-xs text-muted-foreground">To Predict</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User-uploaded mines */}
      {mines.map(mine => (
        <Card 
          key={mine.id}
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => navigate(`/model/${mine.id}`)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{mine.name}</CardTitle>
                  <CardDescription>{mine.location}{mine.country ? ` • ${mine.country}` : ''} • {mine.mine_type ?? 'Mine'}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={mine.dataset_status === 'validated' ? 'default' : 'secondary'}>
                  {mine.dataset_status}
                </Badge>
                {mine.data_quality_score != null && (
                  <Badge variant={gradeColor(mine.data_quality_score)}>
                    Score: {mine.data_quality_score}
                  </Badge>
                )}
                <Button variant="ghost" size="icon" onClick={(e) => handleDelete(mine.id, e)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="p-2 rounded bg-muted/50">
                <p className="font-bold">{mine.total_records}</p>
                <p className="text-xs text-muted-foreground">Records</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="font-bold">{mine.completeness_pct ?? 0}%</p>
                <p className="text-xs text-muted-foreground">Completeness</p>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <p className="font-bold">{new Date(mine.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">Added</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {mines.length === 0 && (
        <Card className="py-12 text-center border-dashed">
          <CardContent>
            <Database className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No custom mine sites yet. Add one by uploading your training CSV.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MineSelector;
