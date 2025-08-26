import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Phone, Ambulance, Shield, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface EmergencyEvent {
  id: string;
  event_type: string;
  status: string;
  emergency_contacts_notified: boolean;
  hospital_contacted: boolean;
  ambulance_contacted: boolean;
  insurance_contacted: boolean;
  notes: string;
  created_at: string;
  resolved_at: string | null;
}

export const EmergencyMonitor = () => {
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyEvents();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('emergency-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_events'
        },
        () => {
          fetchEmergencyEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEmergencyEvents = async () => {
    try {
      const { data: events, error } = await (supabase as any)
        .from('emergency_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEmergencyEvents(events || []);
    } catch (error) {
      console.error('Error fetching emergency events:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveEmergency = async (eventId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('emergency_events')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Emergency resolved');
    } catch (error) {
      toast.error('Error resolving emergency');
    }
  };

  const activeEmergencies = emergencyEvents.filter(e => e.status === 'active');
  const hasActiveEmergency = activeEmergencies.length > 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Emergency Status Header */}
      <Card className={hasActiveEmergency ? "border-destructive bg-destructive/5" : "border-green-500 bg-green-50 dark:bg-green-950/20"}>
        <CardHeader>
          <CardTitle className="flex items-center">
            {hasActiveEmergency ? (
              <>
                <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                <span className="text-destructive">Active Emergency</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                <span className="text-green-700 dark:text-green-400">All Clear</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasActiveEmergency ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Emergency button was pressed. Emergency services are being contacted.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeEmergencies[0] && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">
                        Emergency Contacts: {activeEmergencies[0].emergency_contacts_notified ? "✓" : "⏳"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ambulance className="h-4 w-4" />
                      <span className="text-sm">
                        Ambulance: {activeEmergencies[0].ambulance_contacted ? "✓" : "⏳"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">
                        Hospital: {activeEmergencies[0].hospital_contacted ? "✓" : "⏳"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">
                        Insurance: {activeEmergencies[0].insurance_contacted ? "✓" : "⏳"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active emergencies. Your loved one is safe.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Emergency History */}
      {emergencyEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Emergency History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={event.status === 'active' ? 'destructive' : 'secondary'}
                      >
                        {event.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                    {event.notes && (
                      <p className="text-sm">{event.notes}</p>
                    )}
                  </div>
                  {event.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveEmergency(event.id)}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};