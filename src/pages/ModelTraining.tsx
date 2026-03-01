import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MineSelector from "@/components/MineSelector";
import AddMineForm from "@/components/AddMineForm";

const ModelTraining = () => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const navigate = useNavigate();

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Model Training</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
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
