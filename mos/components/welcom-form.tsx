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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { useUser } from "./UserProvider";

export function WelcomeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setcontactPerson] = useState("");
  const UserRole: UserRole[] = ["BRAND", "MANUFACTURER"];

  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const addedUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.supaUser?.email,
        role: role,
        companyName: companyName,
        contactInfo: {
          phone: phone,
          address: address,
          contactPerson: contactPerson,
        },
      }),
    }).then(() => {
      alert("done");
      router.push("/profile");
    });

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
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='role'>Role</FieldLabel>

                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className='w-45'>
                    <SelectValue placeholder={`Select a Role`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{role}</SelectLabel>
                      {UserRole.map((role, index) => (
                        <SelectItem key={index} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor='companyName'>Company Name</FieldLabel>
                <Input
                  id='companyName'
                  type='text'
                  placeholder='MOS.dev'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </Field>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='phone'>Phone</FieldLabel>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='01xxxxxxxxx'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='address'>Address</FieldLabel>
                  <Input
                    id='address'
                    type='text'
                    placeholder='10 example st, city'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='contactPerson'>contactPerson</FieldLabel>
                  <Input
                    id='contactPerson'
                    type='text'
                    placeholder='Name of company holder'
                    value={contactPerson}
                    onChange={(e) => setcontactPerson(e.target.value)}
                    required
                  />
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
