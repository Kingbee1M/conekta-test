'use client';

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface MapDisplayProps {
  location: LocationCoordinates;
  zoom?: number;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapDisplay({
  location,
  zoom = 15,
  className = 'w-full h-87.5',
}: MapDisplayProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`}>
        <Map
          center={location}
          zoom={zoom}
          mapId="DISPLAY_MAP_ID"
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          <AdvancedMarker position={location}>
            <Pin background="#2a8545" glyphColor="#ffffff" borderColor="#1e5e31" />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}