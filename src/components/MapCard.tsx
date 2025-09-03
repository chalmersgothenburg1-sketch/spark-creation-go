import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Route, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Mock GPS data for the day's travel path
const mockTravelPath = [
  { lat: 40.7128, lng: -74.006, time: '08:00', location: 'Home' },
  { lat: 40.7589, lng: -73.9851, time: '09:30', location: 'Coffee Shop' },
  { lat: 40.7614, lng: -73.9776, time: '10:15', location: 'Central Park' },
  { lat: 40.7505, lng: -73.9934, time: '12:00', location: 'Restaurant' },
  { lat: 40.7282, lng: -73.9942, time: '14:30', location: 'Doctor Visit' },
  { lat: 40.7128, lng: -74.006, time: '16:00', location: 'Home' },
];

interface MapCardProps {
  className?: string;
}

export const MapCard: React.FC<MapCardProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const MapPlaceholder = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`relative ${isModal ? 'h-[70vh]' : 'h-64'} w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center`}>
      <div className="text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Map View</p>
        <p className="text-xs text-muted-foreground">NYC Travel Route</p>
      </div>

      {/* Overlay info */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
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

      {/* Maximize Button on non-modal */}
      {!isModal && (
        <div className="absolute top-4 right-4 z-10">
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
          <MapPlaceholder />

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

          <MapPlaceholder isModal />

          {/* Travel Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
