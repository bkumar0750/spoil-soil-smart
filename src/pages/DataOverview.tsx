import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SatelliteTab from "@/components/data-overview/SatelliteTab";
import FieldDataTab from "@/components/data-overview/FieldDataTab";
import DerivedIndicesTab from "@/components/data-overview/DerivedIndicesTab";
import ProcessingTab from "@/components/data-overview/ProcessingTab";
import VisualizationTab from "@/components/data-overview/VisualizationTab";
import MLTrainingTab from "@/components/data-overview/MLTrainingTab";

const DataOverview = () => {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Data Overview</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive multi-source dataset combining satellite remote sensing, field measurements, derived indices, and ML training pipelines for soil moisture prediction and reclamation suitability analysis.
        </p>
      </div>

      <Tabs defaultValue="satellite" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="satellite">Satellite</TabsTrigger>
          <TabsTrigger value="field">Field Data</TabsTrigger>
          <TabsTrigger value="derived">Derived Indices</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="ml-training">ML Training</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="satellite"><SatelliteTab /></TabsContent>
        <TabsContent value="field"><FieldDataTab /></TabsContent>
        <TabsContent value="derived"><DerivedIndicesTab /></TabsContent>
        <TabsContent value="processing"><ProcessingTab /></TabsContent>
        <TabsContent value="ml-training"><MLTrainingTab /></TabsContent>
        <TabsContent value="visualization"><VisualizationTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default DataOverview;
