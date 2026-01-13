import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidatePath('/', 'layout')
  // Remove the 'role' cookie on signout
  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.set({ name: 'role', value: '', path: '/', expires: new Date(0) })
  return response
}