import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import MineSelector from "@/components/MineSelector";
import AddMineForm from "@/components/AddMineForm";

const ModelTraining = () => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const navigate = useNavigate();

  return (
    <div className="container py-10 md:py-16 space-y-8">
      <div className="space-y-3">
        <Badge variant="outline" className="mb-1">ML Pipeline</Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Model Training</h1>
        <p className="text-muted-foreground max-w-3xl">
          Upload training data for any mine site worldwide. Each dataset is validated for quality and used to train soil moisture prediction models independently.
        </p>
      </div>

      {view === 'list' ? (
        <MineSelector onAddNew={() => setView('add')} />
      ) : (
        <AddMineForm 
          onBack={() => setView('list')} 
          onComplete={(id) => {
            navigate(`/model/${id}`);
          }} 
        />
      )}
    </div>
  );
};

export default ModelTraining;
