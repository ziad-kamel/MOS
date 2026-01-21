"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/UserProvider";
import { Edit } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function profile() {
  const { user: authUser } = useUser();
  if (!authUser.supaUser || !authUser.dbUser) {
    redirect('/login')
  }

  const [edit, setEdit] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("do the logic for update the user data");
    setEdit(!edit);
  };
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
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
      <div className='flex justify-center items-center '>
        <div className='flex flex-col gap-4 w-fit bg-secondary rounded-2xl p-15'>
          <div className='flex items-center gap-4 '>
            <Image
              src={authUser.supaUser.user_metadata.avatar_url}
              alt='user-profile-image'
              width={160}
              height={160}
              className='rounded-full'
            />
            <Button onClick={() => setEdit(!edit)}>
              <Edit />
            </Button>
          </div>

          <div className='flex flex-col'>
            <form onSubmit={handleSubmit}>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Username:</FieldLabel>
                    <Input
                      id='username'
                      type='text'
                      placeholder='Max Leiter'
                      disabled={edit}
                      value={authUser.supaUser.user_metadata.name}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Email:</FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      placeholder='max.leiter@example.com'
                      disabled={edit}
                      value={authUser.supaUser.user_metadata.email}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Role:</FieldLabel>
                    <Input
                      id='role'
                      type='text'
                      placeholder='USER'
                      disabled={true}
                      value={authUser.dbUser.role}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Company Name:</FieldLabel>
                    <Input
                      id='companyName'
                      type='text'
                      placeholder='companyName'
                      disabled={edit}
                      value={authUser.dbUser.companyName}
                    />
                  </Field>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Phone Number:</FieldLabel>
                      <Input
                        id='phone'
                        type='text'
                        placeholder='01xxxxxxxxx'
                        disabled={edit}
                        value={authUser.dbUser.contactInfo?.phone}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Contact Address:</FieldLabel>
                      <Input
                        id='address'
                        type='text'
                        placeholder='10 st, city'
                        disabled={edit}
                        value={authUser.dbUser.contactInfo?.address}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Contact Person:</FieldLabel>
                      <Input
                        id='contactPerson'
                        type='text'
                        placeholder='example'
                        disabled={edit}
                        value={authUser.dbUser.contactInfo?.contactPerson}
                      />
                    </Field>
                  </FieldGroup>
                  <Field>
                    {edit ? <></> : <Button type='submit'>Edit</Button>}
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
