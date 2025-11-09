import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
        {validPoints.map((point) => {
          const moistureValue = parseFloat(point.soil_moisture.average);
          const moistureColor = getMoistureColor(moistureValue);
          
          return (
            <React.Fragment key={point.id}>
              <Circle
                center={[point.latitude, point.longitude]}
                radius={500}
                pathOptions={{
                  color: moistureColor,
                  fillColor: moistureColor,
                  fillOpacity: 0.3,
                }}
              />
              <Marker position={[point.latitude, point.longitude]}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-sm mb-2">{point.location_name}</h3>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="font-medium">Soil Moisture:</span> {moistureValue.toFixed(3)} m³/m³
                      </div>
                      <div>
                        <span className="font-medium">Trend:</span> {point.soil_moisture.trend}
                      </div>
                      <div>
                        <span className="font-medium">Growth Potential:</span> {parseFloat(point.growth_potential.score).toFixed(1)}%
                      </div>
                      <div>
                        <span className="font-medium">Suitability:</span> {point.growth_potential.suitability}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
