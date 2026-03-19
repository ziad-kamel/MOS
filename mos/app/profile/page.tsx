"use client";

import ProfileForm from "@/components/profile-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useUser } from "@/providers/user-provider";

export default function Profile() {
  const { user } = useUser();
  console.log("xxxxxxxxxxxxxx", user);

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
      <ProfileForm />
    </div>
  );
}
