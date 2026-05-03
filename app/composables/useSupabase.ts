import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// SPEC-GAP: supabaseUrl/supabaseKey are server-only runtimeConfig → this composable
// works during SSR but not in a pure client-side context. Move keys to runtimeConfig.public
// if direct client-side Supabase access is needed in a future spec.
let client: SupabaseClient | null = null

export function useSupabase(): SupabaseClient {
  if (!client) {
    const config = useRuntimeConfig()
    client = createClient(
      config.supabaseUrl as string,
      config.supabaseKey as string,
    )
  }
  return client
}
