import { getUserData } from "@/data-acess/DAO/userDAO";
import { UserProvider } from "@/providers/user-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserData();

  return <UserProvider user={user}>{children}</UserProvider>;
}
