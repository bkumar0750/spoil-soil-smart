import { useEffect, useRef } from 'react';
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

const getMoistureColor = (moisture: number) => {
  if (moisture < 0.1) return '#ef4444';
  if (moisture < 0.15) return '#f97316';
  if (moisture < 0.2) return '#eab308';
  if (moisture < 0.25) return '#84cc16';
  return '#22c55e';
};

export const AnalysisMap = ({ analysisPoints, center = [22.1564, 85.5184], zoom = 12 }: AnalysisMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const validPoints = (analysisPoints || []).filter(
      p => p.latitude && p.longitude && p.soil_moisture && p.growth_potential
    );

    const mapCenter: L.LatLngExpression = validPoints.length > 0
      ? [validPoints[0].latitude, validPoints[0].longitude]
      : center;

    const map = L.map(containerRef.current).setView(mapCenter, zoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    validPoints.forEach((point) => {
      const moistureValue = parseFloat(point.soil_moisture.average);
      const color = getMoistureColor(moistureValue);

      L.circle([point.latitude, point.longitude], {
        radius: 500,
        color,
        fillColor: color,
        fillOpacity: 0.3,
      }).addTo(map);

      L.marker([point.latitude, point.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="padding:8px">
            <h3 style="font-weight:600;font-size:14px;margin-bottom:8px">${point.location_name}</h3>
            <div style="font-size:12px;line-height:1.8">
              <div><strong>Soil Moisture:</strong> ${moistureValue.toFixed(3)} m³/m³</div>
              <div><strong>Trend:</strong> ${point.soil_moisture.trend}</div>
              <div><strong>Growth Potential:</strong> ${parseFloat(point.growth_potential.score).toFixed(1)}%</div>
              <div><strong>Suitability:</strong> ${point.growth_potential.suitability}</div>
            </div>
          </div>
        `);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [analysisPoints, center, zoom]);

  if (!analysisPoints || analysisPoints.length === 0) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No analysis locations to display</p>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-[500px] rounded-lg overflow-hidden border" />;
};
