
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }


  return (
    <div>
      <h1>Welcome, {user.user_metadata.full_name}</h1>
      <form action="/auth/signout" method="post">
        <button type="submit">Sign Out</button>
      </form>

      <a href="/home">home</a>
      
    </div>
  )
}
