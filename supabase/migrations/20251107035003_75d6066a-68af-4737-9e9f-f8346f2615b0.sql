-- Create role_audit_logs table to track all role changes
CREATE TABLE public.role_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  changed_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  action TEXT NOT NULL DEFAULT 'assigned'
);

-- Enable RLS
ALTER TABLE public.role_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.role_audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for better query performance
CREATE INDEX idx_role_audit_logs_user_id ON public.role_audit_logs(user_id);
CREATE INDEX idx_role_audit_logs_created_at ON public.role_audit_logs(created_at DESC);