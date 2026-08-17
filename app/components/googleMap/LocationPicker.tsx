'use client';

import { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const DEFAULT_LAGOS_CENTER: LocationCoordinates = { lat: 6.5244, lng: 3.3792 };

// Internal Autocomplete Input Component
function SearchBox({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address', 'name'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect(place);
        if (place.formatted_address) {
          setInput(place.formatted_address);
        }
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [places, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search location (e.g., Alimosho, Ikeja)..."
      className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-green bg-white text-gray-900"
    />
  );
}

// Main Location Picker Wrapper
export default function LocationPicker({
  onLocationSelect,
  initialLocation = DEFAULT_LAGOS_CENTER,
  className = 'w-full h-100',
}: LocationPickerProps) {
  const [selectedPos, setSelectedPos] = useState<LocationCoordinates>(initialLocation);
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>(initialLocation);

  const handleUpdateCoordinates = (coords: LocationCoordinates) => {
    setSelectedPos(coords);
    onLocationSelect(coords);
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMapCenter(coords);
      handleUpdateCoordinates(coords);
    }
  };

  const handleMapClick = (e: { detail: { latLng: { lat: number; lng: number } | null } }) => {
    if (e.detail.latLng) {
      const coords = {
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      };
      handleUpdateCoordinates(coords);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      handleUpdateCoordinates(coords);
    }
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="flex flex-col gap-3 w-full">
        {/* Location Search Bar */}
        <SearchBox onPlaceSelect={handlePlaceSelect} />

        {/* Map View */}
        <div className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`}>
          <Map
            center={mapCenter}
            defaultZoom={13}
            mapId="PICKER_MAP_ID"
            gestureHandling="greedy"
            onClick={handleMapClick}
            className="w-full h-full"
          >
            <AdvancedMarker
              position={selectedPos}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            >
              <Pin background="#2a8545" glyphColor="#ffffff" borderColor="#1e5e31" />
            </AdvancedMarker>
          </Map>
        </div>

        {/* Helper Instructions */}
        <p className="text-xs text-gray-500">
          * Search for your area above, then click on the map or drag the pin to set your exact location.
        </p>
      </div>
    </APIProvider>
  );
}