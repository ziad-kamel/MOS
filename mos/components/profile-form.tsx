"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { deleteUser, updateUserData } from "@/data-acess/DAO/userDAO";
import { updateUserSchema } from "@/lib/schemas";
import { useUser } from "@/providers/user-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type UpdateFormData = z.infer<typeof updateUserSchema>;
export default function ProfileForm() {
  const router = useRouter();
  const { user } = useUser();
  const [edit, setEdit] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  const handleUpdate = async (data: UpdateFormData) => {
    await updateUserData({
      companyName: data.companyName || user.companyName,
      contactInfo: {
        phone: data.contactInfo.phone || user.contactInfo.phone,
        address: data.contactInfo.address || user.contactInfo.address,
        contactPerson:
          data.contactInfo.contactPerson || user.contactInfo.contactPerson,
      },
    });
    setEdit(true);
  };

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
            <form onSubmit={handleSubmit(handleUpdate)}>
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
                    <FieldLabel>Company Name:</FieldLabel>
                    <Input
                      id='companyName'
                      type='text'
                      placeholder='companyName'
                      disabled={edit}
                      defaultValue={user.companyName}
                      {...register("companyName")}
                    />
                    {errors.companyName ? (
                      <h3 className='text-xs text-red-500'>
                        company name is required
                      </h3>
                    ) : (
                      ""
                    )}
                  </Field>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Phone Number:</FieldLabel>
                      <Input
                        id='phone'
                        type='text'
                        placeholder='01xxxxxxxxx'
                        disabled={edit}
                        defaultValue={user.contactInfo.phone}
                        {...register("contactInfo.phone")}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Contact Address:</FieldLabel>
                      <Input
                        id='address'
                        type='text'
                        placeholder='10 st, city'
                        disabled={edit}
                        defaultValue={user.contactInfo.address}
                        {...register("contactInfo.address")}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Contact Person:</FieldLabel>
                      <Input
                        id='contactPerson'
                        type='text'
                        placeholder='example'
                        disabled={edit}
                        defaultValue={user.contactInfo.contactPerson}
                        {...register("contactInfo.contactPerson")}
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
