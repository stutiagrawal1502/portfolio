import { createClient } from '@supabase/supabase-js'

// Public client — safe to use in browser
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client — server-side only, created lazily so missing env at build time
// doesn't crash the module. Call getSupabaseAdmin() in route handlers.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
