import { supabase } from "@/integrations/supabase/client";

export const generateSampleHealthData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Generate sample health metrics for the last 7 days
    const now = new Date();
    const sampleData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Heart rate data (3 times per day)
      for (let j = 0; j < 3; j++) {
        const time = new Date(date);
        time.setHours(8 + j * 6); // 8 AM, 2 PM, 8 PM
        
        sampleData.push({
          user_id: user.id,
          metric_type: 'heart_rate',
          value: { value: 65 + Math.floor(Math.random() * 30) }, // 65-95 bpm
          recorded_at: time.toISOString()
        });
      }

      // Daily steps
      sampleData.push({
        user_id: user.id,
        metric_type: 'steps',
        value: { value: 3000 + Math.floor(Math.random() * 7000) }, // 3000-10000 steps
        recorded_at: date.toISOString()
      });

      // Sleep hours
      sampleData.push({
        user_id: user.id,
        metric_type: 'sleep',
        value: { value: 6 + Math.random() * 3 }, // 6-9 hours
        recorded_at: date.toISOString()
      });

      // Body temperature (morning)
      const morningTime = new Date(date);
      morningTime.setHours(7);
      sampleData.push({
        user_id: user.id,
        metric_type: 'temperature',
        value: { value: 97.5 + Math.random() * 1.5 }, // 97.5-99°F
        recorded_at: morningTime.toISOString()
      });
    }

    const { error } = await (supabase as any)
      .from('health_metrics')
      .insert(sampleData);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error generating sample data:', error);
    return { success: false, error };
  }
};

export const generateSampleEmergencyEvent = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await (supabase as any)
      .from('emergency_events')
      .insert({
        user_id: user.id,
        event_type: 'emergency_button',
        status: 'active',
        emergency_contacts_notified: true,
        hospital_contacted: false,
        ambulance_contacted: false,
        insurance_contacted: false,
        notes: 'Emergency button pressed - sample event for testing'
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error generating sample emergency:', error);
    return { success: false, error };
  }
};