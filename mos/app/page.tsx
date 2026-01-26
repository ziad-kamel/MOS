import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/data-acess/DAO/userDAO";
import { Link } from "lucide-react";

export default async function Page() {
  const data = await getAllUsers();
  return (
    <div>
      <form action='/auth/signout' method='get'>
        <Button type='submit'>Sign Out</Button>
      </form>

      <form action='/auth/signout' method='get'>
        <Button type='submit'>Sign Out</Button>
      </form>
      <div>
        {data.map((user, idx) => (
          <div key={idx}>
            <div>{JSON.stringify(user)}</div>
            <br />
          </div>
        ))}
      </div>
      <a href='/home'>home</a>

      <Button>
        <a href='/welcome'>Get started</a>
      </Button>
    </div>
  );
}
