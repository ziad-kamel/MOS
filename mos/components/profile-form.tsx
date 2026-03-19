"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { deleteUser } from "@/data-acess/DAO/userDAO";

import { useUser } from "@/providers/user-provider";
import { Edit, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProfileForm() {
  const { user } = useUser();
  const [edit, setEdit] = useState(true);

  const handelDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    await deleteUser();
  };
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex justify-center items-center '>
        <div className='flex flex-col gap-4 w-fit bg-secondary rounded-2xl p-15'>
          <div className='flex items-center gap-4 '>
            <Image
              src={user.avatar || "/icon.jpg"}
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
            <form>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Email:</FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      placeholder='max.leiter@example.com'
                      disabled={true}
                      defaultValue={user.email}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Role:</FieldLabel>
                    <Input
                      id='role'
                      type='text'
                      placeholder='USER'
                      disabled={true}
                      defaultValue={user.role?.toString()}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Name:</FieldLabel>
                    <Input
                      id='Name'
                      type='text'
                      placeholder='name'
                      disabled={edit}
                      defaultValue={user.name}
                    />
                  </Field>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Role:</FieldLabel>
                      <Input
                        id='role'
                        type='text'
                        placeholder='01xxxxxxxxx'
                        disabled={edit}
                        defaultValue={user.role}
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
