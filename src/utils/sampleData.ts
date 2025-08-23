import { supabase } from "@/integrations/supabase/client";

export const generateSampleHealthData = async () => {
  try {
    // Mock implementation for demo
    console.log('Sample health data generated (mock)');
    return { success: true };
  } catch (error) {
    console.error('Error generating sample data:', error);
    return { success: false, error };
  }
};

export const generateSampleEmergencyEvent = async () => {
  try {
    // Mock implementation for demo
    console.log('Sample emergency event generated (mock)');
    return { success: true };
  } catch (error) {
    console.error('Error generating sample emergency:', error);
    return { success: false, error };
  }
};