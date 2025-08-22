import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Route, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Mock GPS data for the day's travel path
const mockTravelPath = [
  { lat: 40.7128, lng: -74.0060, time: '08:00', location: 'Home' },
  { lat: 40.7589, lng: -73.9851, time: '09:30', location: 'Coffee Shop' },
  { lat: 40.7614, lng: -73.9776, time: '10:15', location: 'Central Park' },
  { lat: 40.7505, lng: -73.9934, time: '12:00', location: 'Restaurant' },
  { lat: 40.7282, lng: -73.9942, time: '14:30', location: 'Doctor Visit' },
  { lat: 40.7128, lng: -74.0060, time: '16:00', location: 'Home' },
];

interface MapCardProps {
  className?: string;
}

export const MapCard: React.FC<MapCardProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  // Check if Mapbox token is available (you should add this as a Supabase secret)
  useEffect(() => {
    // In a real implementation, you would fetch this from your Supabase secrets
    // For demo purposes, we'll show a token input
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  const handleTokenSave = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      initializeMap();
    }
  };

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Dynamically import mapbox-gl to avoid SSR issues
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');

      mapboxgl.default.accessToken = mapboxToken;

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [mockTravelPath[0].lng, mockTravelPath[0].lat],
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add travel path as a line
        map.current.addSource('travel-path', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: mockTravelPath.map(point => [point.lng, point.lat])
            }
          }
        });

        map.current.addLayer({
          id: 'travel-path',
          type: 'line',
          source: 'travel-path',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Add markers for each location
        mockTravelPath.forEach((point, index) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='%23${index === 0 || index === mockTravelPath.length - 1 ? '10b981' : '3b82f6'}'/%3E%3Ccircle cx='10' cy='10' r='4' fill='white'/%3E%3C/svg%3E")`;
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.backgroundSize = '100%';

          new mapboxgl.default.Marker(el)
            .setLngLat([point.lng, point.lat])
            .setPopup(
              new mapboxgl.default.Popup({ offset: 25 })
                .setHTML(`<div class="p-2"><strong>${point.location}</strong><br/>${point.time}</div>`)
            )
            .addTo(map.current);
        });

        // Fit map to show all points
        const bounds = new mapboxgl.default.LngLatBounds();
        mockTravelPath.forEach(point => bounds.extend([point.lng, point.lat]));
        map.current.fitBounds(bounds, { padding: 50 });
      });

    } catch (error) {
      console.error('Error loading map:', error);
    }
  };

  useEffect(() => {
    if (mapboxToken && !showTokenInput) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, showTokenInput]);

  const MapContent = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`relative ${isModal ? 'h-[70vh]' : 'h-64'} w-full`}>
      {showTokenInput ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-lg p-4">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Add Mapbox Token</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Enter your Mapbox public token to view your location and travel path.
            <br />
            Get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              placeholder="pk.eyJ1IjoiYWJj..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSave} disabled={!mapboxToken.trim()}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapContainer} className="w-full h-full rounded-lg" />
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Today's Journey</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Start/End: Home</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Visited: 4 locations</span>
              </div>
            </div>
          </div>
          {!isModal && (
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="bg-background/90 backdrop-blur-sm"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <Card className={`overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Location & Travel</h3>
            </div>
          </div>
          <MapContent />
          
          {/* Travel Summary */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">2.3</p>
              <p className="text-xs text-muted-foreground">Miles Traveled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">4</p>
              <p className="text-xs text-muted-foreground">Locations Visited</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">8h</p>
              <p className="text-xs text-muted-foreground">Time Out</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Expanded Map Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Today's Travel Path
            </DialogTitle>
          </DialogHeader>
          <MapContent isModal />
          
          {/* Travel Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-primary">2.3 mi</p>
              <p className="text-xs text-muted-foreground">Total Distance</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-600">4</p>
              <p className="text-xs text-muted-foreground">Locations</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-600">8h 00m</p>
              <p className="text-xs text-muted-foreground">Time Out</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-orange-600">1,250</p>
              <p className="text-xs text-muted-foreground">Steps</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};