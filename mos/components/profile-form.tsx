"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/UserProvider";
import { Edit, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default function ProfileForm() {
  const router = useRouter();
  const { user: authUser } = useUser();
  const [edit, setEdit] = useState(true);

  const [companyName, setCompanyName] = useState(authUser.dbUser?.companyName);
  const [phone, setPhone] = useState(authUser.dbUser?.contactInfo?.phone);
  const [address, setAddress] = useState(authUser.dbUser?.contactInfo?.address);
  const [contactPerson, setcontactPerson] = useState(authUser.dbUser?.contactInfo?.contactPerson);

  if (!authUser.supaUser || !authUser.dbUser) {
    redirect("/login");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateResponse = await fetch(`${baseUrl}/api/user/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authUser.dbUser?.email,
        companyName: companyName,
        contactInfo: {
          phone: phone,
          address: address,
          contactPerson: contactPerson,
        },
      }),
    });
    setEdit(!edit);
    router.refresh()
  };

  const handelDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const deleteResponse = await fetch(`${baseUrl}/api/user/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authUser.dbUser?.email,
      }),
    });
    if (deleteResponse.ok) {
      router.push("/auth/signout");
    } else {
      alert(baseUrl);
      alert("error while deleting");
    }
  };
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
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
            <Button variant={"destructive"} onClick={handelDelete}>
              <Trash2Icon />
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
                      disabled={true}
                      value={authUser.supaUser.user_metadata.name}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Email:</FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      placeholder='max.leiter@example.com'
                      disabled={true}
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
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Contact Address:</FieldLabel>
                      <Input
                        id='address'
                        type='text'
                        placeholder='10 st, city'
                        disabled={edit}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Contact Person:</FieldLabel>
                      <Input
                        id='contactPerson'
                        type='text'
                        placeholder='example'
                        disabled={edit}
                        value={contactPerson}
                        onChange={(e) => setcontactPerson(e.target.value)}
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
