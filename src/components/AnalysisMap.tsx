import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarkers } from './MapMarkers';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AnalysisPoint {
  id: string;
  latitude: number;
  longitude: number;
  location_name: string;
  soil_moisture: {
    average: string;
    trend: string;
  };
  growth_potential: {
    score: string;
    suitability: string;
  };
}

interface AnalysisMapProps {
  analysisPoints: AnalysisPoint[];
  center?: [number, number];
  zoom?: number;
}

// Function to get color based on soil moisture
const getMoistureColor = (moisture: number) => {
  if (moisture < 0.1) return '#ef4444'; // red - very dry
  if (moisture < 0.15) return '#f97316'; // orange - dry
  if (moisture < 0.2) return '#eab308'; // yellow - moderate
  if (moisture < 0.25) return '#84cc16'; // lime - good
  return '#22c55e'; // green - excellent
};

// Function to get color based on growth potential score
const getPotentialColor = (score: number) => {
  if (score < 40) return '#ef4444'; // red - poor
  if (score < 60) return '#f97316'; // orange - fair
  if (score < 75) return '#eab308'; // yellow - good
  if (score < 85) return '#84cc16'; // lime - very good
  return '#22c55e'; // green - excellent
};

export const AnalysisMap = ({ analysisPoints, center = [22.1564, 85.5184], zoom = 12 }: AnalysisMapProps) => {
  // Return null if no data
  if (!analysisPoints || analysisPoints.length === 0) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No analysis locations to display</p>
      </div>
    );
  }

  // Calculate center from first point if available
  const mapCenter: [number, number] = analysisPoints.length > 0 && analysisPoints[0].latitude && analysisPoints[0].longitude
    ? [analysisPoints[0].latitude, analysisPoints[0].longitude]
    : center;

  const validPoints = analysisPoints.filter(
    point => point.latitude && point.longitude && point.soil_moisture && point.growth_potential
  );

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarkers points={validPoints} getMoistureColor={getMoistureColor} />
      </MapContainer>
    </div>
  );
};
