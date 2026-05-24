import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  // Show the project ID from the URL so we can verify it matches Supabase dashboard
  const projectId = url.replace('https://', '').split('.')[0] || '(empty)'

  let supabaseTest: { ok: boolean; error?: string; count?: number } = { ok: false }

  if (url && hasKey) {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('waitlist')
        .select('email', { count: 'exact' })
      if (error) {
        supabaseTest = { ok: false, error: error.message }
      } else {
        supabaseTest = { ok: true, count: data?.length ?? 0 }
      }
    } catch (e: unknown) {
      supabaseTest = { ok: false, error: String(e) }
    }
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url ? `✅ set — project: ${projectId}` : '❌ missing',
      SUPABASE_SERVICE_ROLE_KEY: hasKey ? '✅ set' : '❌ missing',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ set' : '❌ missing (default: mehdi2026)',
    },
    supabase: supabaseTest,
  })
}
