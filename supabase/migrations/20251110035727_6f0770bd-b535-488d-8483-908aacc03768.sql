-- Create admin_notifications table
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('role_change', 'suspicious_activity', 'bulk_action', 'profile_update')),
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  user_id uuid,
  metadata jsonb,
  read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.admin_notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update notifications (mark as read)
CREATE POLICY "Admins can update notifications"
ON public.admin_notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes
CREATE INDEX idx_notifications_created_at ON public.admin_notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON public.admin_notifications(read) WHERE read = false;
CREATE INDEX idx_notifications_user_id ON public.admin_notifications(user_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_admin_notification(
  p_title text,
  p_message text,
  p_type text,
  p_severity text DEFAULT 'info',
  p_user_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.admin_notifications (title, message, type, severity, user_id, metadata)
  VALUES (p_title, p_message, p_type, p_severity, p_user_id, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger to notify on role changes
CREATE OR REPLACE FUNCTION public.notify_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
  changer_email text;
BEGIN
  -- Get user email
  SELECT email INTO user_email FROM public.profiles WHERE id = NEW.user_id;
  
  -- Get changer email
  SELECT email INTO changer_email FROM public.profiles WHERE id = NEW.changed_by;
  
  -- Create notification
  PERFORM create_admin_notification(
    'Role Change Detected',
    format('User %s role %s to %s by %s', user_email, NEW.action, NEW.role, changer_email),
    'role_change',
    CASE WHEN NEW.role = 'admin' THEN 'warning' ELSE 'info' END,
    NEW.user_id,
    jsonb_build_object(
      'action', NEW.action,
      'role', NEW.role,
      'changed_by', NEW.changed_by,
      'user_email', user_email,
      'changer_email', changer_email
    )
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_on_role_change
AFTER INSERT ON public.role_audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.notify_role_change();

-- Function to detect suspicious activity
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  suspicious_user record;
BEGIN
  -- Check for multiple profile updates in last 5 minutes
  FOR suspicious_user IN
    SELECT 
      user_id,
      COUNT(*) as update_count,
      MAX(created_at) as last_update
    FROM public.activity_logs
    WHERE action_type = 'profile_update'
      AND created_at > NOW() - INTERVAL '5 minutes'
    GROUP BY user_id
    HAVING COUNT(*) >= 5
  LOOP
    -- Create notification for suspicious activity
    PERFORM create_admin_notification(
      'Suspicious Activity Detected',
      format('User has made %s profile updates in the last 5 minutes', suspicious_user.update_count),
      'suspicious_activity',
      'warning',
      suspicious_user.user_id,
      jsonb_build_object(
        'update_count', suspicious_user.update_count,
        'last_update', suspicious_user.last_update,
        'pattern', 'rapid_profile_updates'
      )
    );
  END LOOP;
  
  -- Check for multiple role changes for same user in last hour
  FOR suspicious_user IN
    SELECT 
      user_id,
      COUNT(*) as change_count,
      MAX(created_at) as last_change
    FROM public.role_audit_logs
    WHERE created_at > NOW() - INTERVAL '1 hour'
    GROUP BY user_id
    HAVING COUNT(*) >= 3
  LOOP
    PERFORM create_admin_notification(
      'Suspicious Role Changes Detected',
      format('User has had %s role changes in the last hour', suspicious_user.change_count),
      'suspicious_activity',
      'critical',
      suspicious_user.user_id,
      jsonb_build_object(
        'change_count', suspicious_user.change_count,
        'last_change', suspicious_user.last_change,
        'pattern', 'rapid_role_changes'
      )
    );
  END LOOP;
END;
$$;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;