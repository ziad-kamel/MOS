import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const authUser = await getCurrentUser();

  if (!authUser) {
    throw new Error("user not authinticated")
  }

  return (
    <div>
      <h1>Welcome, {authUser.supaUser.user_metadata.full_name}</h1>
      <form action='/auth/signout' method='get'>
        <Button type='submit'>Sign Out</Button>
      </form>

      <a href='/home'>home</a>
    </div>
  );
}
