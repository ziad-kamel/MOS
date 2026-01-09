
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  console.log(user);
  
  if (!user) {
    redirect('/login')
  }

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <form action="/auth/signout" method="post">
        <button type="submit">Sign Out</button>
      </form>
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
