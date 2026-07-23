import * as L from 'leaflet';

import {
  useEffect,
  useRef,
} from 'react';

import 'leaflet/dist/leaflet.css';

import type {
  HeatmapPoint,
} from '../../data/premiumAnalyticsApi';

interface PremiumHeatmapMapProps {
  points: HeatmapPoint[];
}

function intensityColor(
  intensity: number,
): string {
  if (intensity >= 80) return '#c0392b';
  if (intensity >= 55) return '#e67e22';
  if (intensity >= 30) return '#d4a017';
  return '#2e8b57';
}

export function PremiumHeatmapMap({
  points,
}: PremiumHeatmapMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map =
      L.map(
        containerRef.current,
        {
          zoomControl: true,
        },
      ).setView(
        [16.75, -93.11],
        7,
      );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; OpenStreetMap contributors',
      },
    ).addTo(map);

    const bounds:
      L.LatLngExpression[] = [];

    points.forEach((point) => {
      const latitude =
        Number(point.latitude);

      const longitude =
        Number(point.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      bounds.push([
        latitude,
        longitude,
      ]);

      const marker =
        L.circleMarker(
          [latitude, longitude],
          {
            radius:
              8 +
              Math.min(
                16,
                Math.max(0, point.intensity) * 0.12,
              ),
            color:
              intensityColor(point.intensity),
            fillColor:
              intensityColor(point.intensity),
            fillOpacity: 0.5,
            weight: 2,
          },
        ).addTo(map);

      const popup =
        document.createElement('div');

      const title =
        document.createElement('strong');

      title.textContent =
        point.name;

      const detail =
        document.createElement('div');

      detail.textContent =
        `Intensidad relativa: ${point.intensity}/100`;

      popup.append(
        title,
        detail,
      );

      marker.bindPopup(popup);
    });

    if (bounds.length > 0) {
      map.fitBounds(
        L.latLngBounds(bounds),
        {
          padding: [30, 30],
          maxZoom: 12,
        },
      );
    }

    window.setTimeout(
      () => map.invalidateSize(),
      0,
    );

    return () => {
      map.remove();
    };
  }, [points]);

  return (
    <div
      ref={containerRef}
      className="premium-heatmap-map"
      aria-label="Mapa de calor de interés turístico"
    />
  );
}
