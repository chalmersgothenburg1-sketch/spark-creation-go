-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_metrics table for watch data
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- 'heart_rate', 'blood_pressure', 'steps', 'sleep', 'temperature'
  value JSONB NOT NULL, -- flexible storage for different metric types
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency_events table
CREATE TABLE public.emergency_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'emergency_button',
  location JSONB, -- lat, lng, address
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'resolved', 'cancelled'
  emergency_contacts_notified BOOLEAN DEFAULT false,
  hospital_contacted BOOLEAN DEFAULT false,
  ambulance_contacted BOOLEAN DEFAULT false,
  insurance_contacted BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  prescribing_doctor TEXT,
  start_date DATE,
  end_date DATE,
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance_details table
CREATE TABLE public.insurance_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_name TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  group_number TEXT,
  coverage_type TEXT,
  file_url TEXT,
  expiry_date DATE,
  emergency_contact_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_details ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for health_metrics
CREATE POLICY "Users can view their own health metrics" 
ON public.health_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" 
ON public.health_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for emergency_events
CREATE POLICY "Users can view their own emergency events" 
ON public.emergency_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emergency events" 
ON public.emergency_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency events" 
ON public.emergency_events 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for prescriptions
CREATE POLICY "Users can view their own prescriptions" 
ON public.prescriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prescriptions" 
ON public.prescriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescriptions" 
ON public.prescriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prescriptions" 
ON public.prescriptions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for insurance_details
CREATE POLICY "Users can view their own insurance details" 
ON public.insurance_details 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insurance details" 
ON public.insurance_details 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insurance details" 
ON public.insurance_details 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insurance details" 
ON public.insurance_details 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_details_updated_at
  BEFORE UPDATE ON public.insurance_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('insurance', 'insurance', false);

-- Create storage policies for prescriptions
CREATE POLICY "Users can view their own prescription files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own prescription files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own prescription files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own prescription files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for insurance
CREATE POLICY "Users can view their own insurance files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'insurance' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own insurance files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'insurance' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own insurance files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'insurance' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own insurance files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'insurance' AND auth.uid()::text = (storage.foldername(name))[1]);