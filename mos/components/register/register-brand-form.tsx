"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { registerNewBrand } from "@/data-acess/DAO/userDAO";
import { UserRole } from "@/app/generated/prisma";
import { registerBrandSchema } from "@/lib/schemas";

type registerBrandData = z.infer<typeof registerBrandSchema>;
export function NewBrandForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerBrandData>({
    resolver: zodResolver(registerBrandSchema),
  });

  const handleRegisterNewUser = async (data: registerBrandData) => {
    setLoading(true);
    await registerNewBrand({ ...data });
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegisterNewUser)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='warehouseAddress'>
                  Warehouse Address *
                </FieldLabel>
                <Input
                  id='warehouseAddress'
                  type='text'
                  placeholder='123 Main St, Anytown, USA'
                  required
                  {...register("warehouseAddress")}
                />
                {errors.warehouseAddress && (
                  <p className='text-xs text-red-500'>
                    {errors.warehouseAddress.message}
                  </p>
                )}
              </Field>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='contactNo1'>Contact No. 1 *</FieldLabel>
                  <Input
                    id='contactNo1'
                    type='tel'
                    placeholder='01xxxxxxxxx'
                    {...register("contactNo1")}
                  />
                  {errors.contactNo1 && (
                    <p className='text-xs text-red-500'>
                      {errors.contactNo1.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor='contactNo2'>Contact No. 2</FieldLabel>
                  <Input
                    id='contactNo2'
                    type='tel'
                    placeholder='01xxxxxxxxx'
                    {...register("contactNo2")}
                  />
                  {errors.contactNo2 && (
                    <p className='text-xs text-red-500'>
                      {errors.contactNo2.message}
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
