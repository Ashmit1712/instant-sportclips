-- Update get_user_list function to accept search and filter parameters
CREATE OR REPLACE FUNCTION public.get_user_list(
  page_limit integer DEFAULT 10,
  page_offset integer DEFAULT 0,
  search_term text DEFAULT '',
  role_filter app_role DEFAULT NULL
)
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
  WHERE 
    (search_term = '' OR 
     LOWER(p.email) LIKE LOWER('%' || search_term || '%') OR 
     LOWER(COALESCE(p.full_name, '')) LIKE LOWER('%' || search_term || '%'))
    AND (role_filter IS NULL OR ur.role = role_filter)
  ORDER BY p.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
$$;

-- Update get_user_count function to accept search and filter parameters
CREATE OR REPLACE FUNCTION public.get_user_count(
  search_term text DEFAULT '',
  role_filter app_role DEFAULT NULL
)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE 
    (search_term = '' OR 
     LOWER(p.email) LIKE LOWER('%' || search_term || '%') OR 
     LOWER(COALESCE(p.full_name, '')) LIKE LOWER('%' || search_term || '%'))
    AND (role_filter IS NULL OR ur.role = role_filter);
$$;