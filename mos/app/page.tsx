import { Button } from "@/components/ui/button";
import { authCheck } from "@/data-acess/auth-user";
import { Link } from "lucide-react";

export default async function Page() {
  const loggedInUser = await authCheck();
  console.log(loggedInUser);

  return (
    <div>
      <form action='/auth/signout' method='get'>
        <Button type='submit'>Sign Out</Button>
      </form>

      <form action='/auth/signout' method='get'>
        <Button type='submit'>Sign Out</Button>
      </form>

      <a href='/home'>home</a>

      <Button>
        <a href='/register'>Get started</a>
      </Button>
    </div>
  );
}
