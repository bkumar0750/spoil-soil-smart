import { Fragment } from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';

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

interface MapMarkersProps {
  points: AnalysisPoint[];
  getMoistureColor: (moisture: number) => string;
}

export const MapMarkers = ({ points, getMoistureColor }: MapMarkersProps) => {
  return (
    <>
      {points.map((point) => {
        const moistureValue = parseFloat(point.soil_moisture.average);
        const potentialScore = parseFloat(point.growth_potential.score);
        const moistureColor = getMoistureColor(moistureValue);
        
        return (
          <Fragment key={point.id}>
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
                      <span className="font-medium">Growth Potential:</span> {potentialScore.toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Suitability:</span> {point.growth_potential.suitability}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </Fragment>
        );
      })}
    </>
  );
};
