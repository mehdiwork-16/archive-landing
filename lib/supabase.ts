import { createClient } from '@supabase/supabase-js'

const url   = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key   = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side only client (uses service role key — never expose to browser)
export const supabase = createClient(url, key)
