// Beduine customer ledger Edge Function.
// Returns authenticated user's TRC/DC ledger. Deploy after Supabase credentials are available.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !serviceRoleKey || !anonKey) return new Response('Missing Supabase configuration', { status: 500 });

  const authHeader = req.headers.get('authorization') || '';
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: auth, error: authError } = await userClient.auth.getUser();
  if (authError || !auth.user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json().catch(() => ({}));
  const requestedUserId = String(body.userId || auth.user.id);
  if (requestedUserId !== auth.user.id) return new Response('Cannot read another user ledger', { status: 403 });

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await admin
    .from('credit_ledger')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false });

  if (error) return new Response(error.message, { status: 500 });
  return Response.json({ ledger: data || [] });
});
