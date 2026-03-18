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

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function profile() {
  const user = await getUserData();

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
