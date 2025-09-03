import React from 'react';
import { MapPin } from 'lucide-react';

export const SimpleMap = ({ latitude, longitude }: { latitude: number; longitude: number }) => (
  <div className="h-96 w-full bg-muted rounded-lg flex items-center justify-center">
    <div className="text-center">
      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">Location Map</p>
      <p className="text-xs text-muted-foreground">
        {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
    </div>
  </div>
);
