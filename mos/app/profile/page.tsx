import ProfileForm from "@/components/profile-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { UserProvider } from "@/providers/user-provider";
import { getUserData } from "@/data-acess/DAO/userDAO";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function profile() {
  // const user = await getUserData();
  // console.log("xxxxxxxxxxxxxx", user);
  const user = {
    id: "928c4c69-4db0-4921-892c-56c27823a863",
    name: "ziad kamell",
    email: "ziad.mohamed.kamell.184@gmail.com",
    role: "BRAND",
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocJlw0pcBD93FWTkJetgbR56okMGmCHXktb6KTgqjnInwCgqggw=s96-c",
  };

  return (
    <div className='flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='flex w-full'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <UserProvider user={user}>
        <ProfileForm />
      </UserProvider>
    </div>
  );
}
