-- Create function to get user list with roles and last login
CREATE OR REPLACE FUNCTION public.get_user_list()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role app_role,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.email,
    p.full_name,
    ur.role,
    p.created_at,
    au.last_sign_in_at
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
$$;

-- Add RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));