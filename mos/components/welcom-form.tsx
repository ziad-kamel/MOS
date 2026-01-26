"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserRole } from "@/app/generated/prisma/enums";
import { useForm, Controller } from "react-hook-form";
import { registerUserSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  getUserData,
  registerNewUser,
  registerUserData,
} from "@/data-acess/DAO/userDAO";
import { useUser } from "@/providers/user-provider";

export function WelcomeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const UserRoleOptions: UserRole[] = ["BRAND", "MANUFACTURER"];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<registerUserData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      role: "BRAND",
    },
  });

  const handleRegisterNewUser = async (data: registerUserData) => {
    setLoading(true);
    await registerNewUser({ ...data });
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Complete Profile</CardTitle>
          <CardDescription>
            Please complete the fields to use the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegisterNewUser)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='role'>Role</FieldLabel>

                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <SelectTrigger className='w-45'>
                        <SelectValue placeholder={`Select a Role`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Role</SelectLabel>
                          {UserRoleOptions.map((roleOption, index) => (
                            <SelectItem key={index} value={roleOption}>
                              {roleOption}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      {errors.role && (
                        <p className='text-xs text-red-500'>
                          {errors.role.message}
                        </p>
                      )}
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='companyName'>Company Name</FieldLabel>
                <Input
                  id='companyName'
                  type='text'
                  placeholder='MOS.dev'
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className='text-xs text-red-500'>
                    {errors.companyName.message}
                  </p>
                )}
              </Field>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='phone'>Phone</FieldLabel>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='01xxxxxxxxx'
                    {...register("contactInfo.phone")}
                  />
                  {errors.contactInfo?.phone && (
                    <p className='text-xs text-red-500'>
                      {errors.contactInfo.phone.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor='address'>Address</FieldLabel>
                  <Input
                    id='address'
                    type='text'
                    placeholder='10 example st, city'
                    {...register("contactInfo.address")}
                  />
                  {errors.contactInfo?.address && (
                    <p className='text-xs text-red-500'>
                      {errors.contactInfo.address.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor='contactPerson'>contactPerson</FieldLabel>
                  <Input
                    id='contactPerson'
                    type='text'
                    placeholder='Name of company holder'
                    {...register("contactInfo.contactPerson")}
                  />
                  {errors.contactInfo?.contactPerson && (
                    <p className='text-xs text-red-500'>
                      {errors.contactInfo.contactPerson.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <Field>
                <Button type='submit' disabled={loading}>
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
