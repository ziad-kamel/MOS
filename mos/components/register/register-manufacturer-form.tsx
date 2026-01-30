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
import { registerManufacturerSchema } from "@/lib/schemas";
import { registerNewManufacturer } from "@/data-acess/DAO/userDAO";

type registerManufacturerData = z.infer<typeof registerManufacturerSchema>;
export function NewManufacturerForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerManufacturerData>({
    resolver: zodResolver(registerManufacturerSchema),
  });

  const handleRegisterNewUser = async (data: registerManufacturerData) => {
    setLoading(true);
    await registerNewManufacturer({ ...data });
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegisterNewUser)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='factoryAddress'>
                  Factory Address *
                </FieldLabel>
                <Input
                  id='factoryAddress'
                  type='text'
                  placeholder='123 Main St, Anytown, USA'
                  {...register("factoryAddress")}
                />
                {errors.factoryAddress && (
                  <p className='text-xs text-red-500'>
                    {errors.factoryAddress.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor='limitPerOrder'>
                  Limit Per Order *
                </FieldLabel>
                <Input
                  id='limitPerOrder'
                  type='number'
                  min={10}
                  placeholder='minimum 10'
                  {...register("limitPerOrder")}
                />
                {errors.limitPerOrder && (
                  <p className='text-xs text-red-500'>
                    {errors.limitPerOrder.message}
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
                  <FieldLabel htmlFor='contactNo2'>
                    Contact No. 2 (optional)
                  </FieldLabel>
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
