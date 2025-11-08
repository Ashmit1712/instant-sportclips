-- Update get_user_list function to accept sorting parameters
CREATE OR REPLACE FUNCTION public.get_user_list(
  page_limit integer DEFAULT 10,
  page_offset integer DEFAULT 0,
  search_term text DEFAULT '',
  role_filter app_role DEFAULT NULL,
  sort_by text DEFAULT 'created_at',
  sort_direction text DEFAULT 'desc'
)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role app_role,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT 
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
      ($1 = '''' OR 
       LOWER(p.email) LIKE LOWER(''%%'' || $1 || ''%%'') OR 
       LOWER(COALESCE(p.full_name, '''')) LIKE LOWER(''%%'' || $1 || ''%%''))
      AND ($2::app_role IS NULL OR ur.role = $2)
    ORDER BY %I %s NULLS LAST
    LIMIT $3
    OFFSET $4',
    sort_by,
    CASE WHEN sort_direction = 'asc' THEN 'ASC' ELSE 'DESC' END
  )
  USING search_term, role_filter, page_limit, page_offset;
END;
$$;