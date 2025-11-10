-- Create activity_logs table to track user activities
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  action_details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Function to log profile updates
CREATE OR REPLACE FUNCTION public.log_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if something actually changed
  IF (OLD.full_name IS DISTINCT FROM NEW.full_name) OR 
     (OLD.email IS DISTINCT FROM NEW.email) THEN
    INSERT INTO public.activity_logs (user_id, action_type, action_details)
    VALUES (
      NEW.id,
      'profile_update',
      jsonb_build_object(
        'changes', jsonb_build_object(
          'full_name', jsonb_build_object('old', OLD.full_name, 'new', NEW.full_name),
          'email', jsonb_build_object('old', OLD.email, 'new', NEW.email)
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for profile updates
CREATE TRIGGER log_profile_update_trigger
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.log_profile_update();