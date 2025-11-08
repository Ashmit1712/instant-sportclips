import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkRoleRequest {
  userIds: string[];
  role: 'admin' | 'client';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is an admin
    const { data: isAdmin, error: roleCheckError } = await supabaseClient
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleCheckError || !isAdmin) {
      console.error('Admin check error:', roleCheckError);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { userIds, role }: BulkRoleRequest = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'userIds array is required and must not be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!role || !['admin', 'client'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be "admin" or "client"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Bulk assigning role ${role} to ${userIds.length} users`);

    let successCount = 0;
    let failureCount = 0;
    const errors: Array<{ userId: string; error: string }> = [];

    // Process each user
    for (const userId of userIds) {
      try {
        // Delete existing role
        const { error: deleteError } = await supabaseClient
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          console.error(`Error deleting role for user ${userId}:`, deleteError);
          failureCount++;
          errors.push({ userId, error: deleteError.message });
          continue;
        }

        // Insert new role
        const { error: insertError } = await supabaseClient
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (insertError) {
          console.error(`Error inserting role for user ${userId}:`, insertError);
          failureCount++;
          errors.push({ userId, error: insertError.message });
          continue;
        }

        // Log audit trail
        const { error: auditError } = await supabaseClient
          .from('role_audit_logs')
          .insert({
            user_id: userId,
            role,
            action: 'assigned',
            changed_by: user.id,
          });

        if (auditError) {
          console.warn(`Failed to log audit trail for user ${userId}:`, auditError);
        }

        successCount++;
      } catch (error) {
        console.error(`Unexpected error processing user ${userId}:`, error);
        failureCount++;
        errors.push({ userId, error: String(error) });
      }
    }

    console.log(`Bulk role assignment complete: ${successCount} succeeded, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        successCount,
        failureCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in bulk-assign-role:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
