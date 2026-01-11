
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  console.log(user?.id, user?.email, user?.user_metadata.full_name);



    const resData = await fetch('http://localhost:3000/login/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user:{id: user?.id, email: user?.email, full_name: user?.user_metadata.full_name} }),
    })
    
  const users = await prisma.user.findMany()
  console.log(users);
  
  if (!user) {
    redirect('/login')
  }


  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <form action="/auth/signout" method="post">
        <button type="submit">Sign Out</button>
      </form>

      <ul>
        {users?.map((user: any) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}
