
import * as L from 'leaflet';
import {
  useEffect,
  useRef,
} from 'react';

import 'leaflet/dist/leaflet.css';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

interface LocationPickerMapProps {
  coordinates: MapCoordinates;
  onChange: (
    coordinates: MapCoordinates,
  ) => void;
  className?: string;
}

const markerIcon = L.divIcon({
  className: 'ec-map-marker',
  html: '<span class="ec-map-marker__pin"><span></span></span>',
  iconSize: [34, 42],
  iconAnchor: [17, 40],
});

export function LocationPickerMap({
  coordinates,
  onChange,
  className = '',
}: LocationPickerMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const mapRef =
    useRef<L.Map | null>(null);

  const markerRef =
    useRef<L.Marker | null>(null);

  const onChangeRef =
    useRef(onChange);

  useEffect(() => {
    onChangeRef.current =
      onChange;
  }, [onChange]);

  useEffect(() => {
    if (
      !containerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map = L.map(
      containerRef.current,
      {
        zoomControl: true,
      },
    ).setView(
      [
        coordinates.lat,
        coordinates.lng,
      ],
      14,
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; OpenStreetMap contributors',
      },
    ).addTo(map);

    const marker = L.marker(
      [
        coordinates.lat,
        coordinates.lng,
      ],
      {
        draggable: true,
        icon: markerIcon,
      },
    ).addTo(map);

    const emit = (
      lat: number,
      lng: number,
    ) => {
      marker.setLatLng([
        lat,
        lng,
      ]);

      onChangeRef.current({
        lat,
        lng,
      });
    };

    map.on(
      'click',
      (event: L.LeafletMouseEvent) => {
        emit(
          event.latlng.lat,
          event.latlng.lng,
        );
      },
    );

    marker.on(
      'dragend',
      () => {
        const point =
          marker.getLatLng();

        emit(
          point.lat,
          point.lng,
        );
      },
    );

    mapRef.current = map;
    markerRef.current = marker;

    window.setTimeout(
      () => map.invalidateSize(),
      0,
    );

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // El mapa se inicializa una sola vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const marker =
      markerRef.current;

    const map =
      mapRef.current;

    if (!marker || !map) {
      return;
    }

    marker.setLatLng([
      coordinates.lat,
      coordinates.lng,
    ]);

    map.panTo(
      [
        coordinates.lat,
        coordinates.lng,
      ],
      {
        animate: true,
      },
    );
  }, [
    coordinates.lat,
    coordinates.lng,
  ]);

  return (
    <div
      ref={containerRef}
      className={`ec-location-map ${className}`}
      aria-label="Mapa para seleccionar ubicación"
    />
  );
}
