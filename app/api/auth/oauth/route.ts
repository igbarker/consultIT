import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider') // 'google' or 'microsoft'
  const redirectTo = searchParams.get('redirect_to') || '/conversation'

  if (!provider || !['google', 'microsoft'].includes(provider)) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'azure',
    options: {
      redirectTo: `${req.nextUrl.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.redirect(data.url)
}

