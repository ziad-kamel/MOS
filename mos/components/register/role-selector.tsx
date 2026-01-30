"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { FieldGroup } from "../ui/field";
import { NewBrandForm } from "./register-brand-form";
import { NewManufacturerForm } from "./register-manufacturer-form";

export default function roleSelector({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [role, setRole] = useState("");
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to MOS</CardTitle>
          <CardDescription>Please select your role</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='mb-4'>
            <Button
              variant={role === "BRAND" ? "default" : "outline"}
              onClick={() => setRole("BRAND")}
            >
              Brand
            </Button>
            <Button
              variant={role === "MANUFACTURER" ? "default" : "outline"}
              onClick={() => setRole("MANUFACTURER")}
            >
              Manufacturer
            </Button>
          </FieldGroup>
          <FieldGroup>
            {role === "BRAND" && <NewBrandForm />}
            {role === "MANUFACTURER" && <NewManufacturerForm />}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
