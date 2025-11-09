-- Update get_user_list function to support date range filtering
CREATE OR REPLACE FUNCTION public.get_user_list(
  page_limit integer DEFAULT 10,
  page_offset integer DEFAULT 0,
  search_term text DEFAULT '',
  role_filter app_role DEFAULT NULL,
  sort_by text DEFAULT 'created_at',
  sort_direction text DEFAULT 'desc',
  created_from timestamp with time zone DEFAULT NULL,
  created_to timestamp with time zone DEFAULT NULL,
  login_from timestamp with time zone DEFAULT NULL,
  login_to timestamp with time zone DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  role app_role,
  created_at timestamp with time zone,
  last_sign_in_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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
      AND ($5::timestamp with time zone IS NULL OR p.created_at >= $5)
      AND ($6::timestamp with time zone IS NULL OR p.created_at <= $6)
      AND ($7::timestamp with time zone IS NULL OR au.last_sign_in_at >= $7)
      AND ($8::timestamp with time zone IS NULL OR au.last_sign_in_at <= $8)
    ORDER BY %I %s NULLS LAST
    LIMIT $3
    OFFSET $4',
    sort_by,
    CASE WHEN sort_direction = 'asc' THEN 'ASC' ELSE 'DESC' END
  )
  USING search_term, role_filter, page_limit, page_offset, created_from, created_to, login_from, login_to;
END;
$$;

-- Update get_user_count function to support date range filtering
CREATE OR REPLACE FUNCTION public.get_user_count(
  search_term text DEFAULT '',
  role_filter app_role DEFAULT NULL,
  created_from timestamp with time zone DEFAULT NULL,
  created_to timestamp with time zone DEFAULT NULL,
  login_from timestamp with time zone DEFAULT NULL,
  login_to timestamp with time zone DEFAULT NULL
)
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  LEFT JOIN auth.users au ON p.id = au.id
  WHERE 
    (search_term = '' OR 
     LOWER(p.email) LIKE LOWER('%' || search_term || '%') OR 
     LOWER(COALESCE(p.full_name, '')) LIKE LOWER('%' || search_term || '%'))
    AND (role_filter IS NULL OR ur.role = role_filter)
    AND (created_from IS NULL OR p.created_at >= created_from)
    AND (created_to IS NULL OR p.created_at <= created_to)
    AND (login_from IS NULL OR au.last_sign_in_at >= login_from)
    AND (login_to IS NULL OR au.last_sign_in_at <= login_to);
$$;