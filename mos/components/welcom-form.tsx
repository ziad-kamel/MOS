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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function WelcomeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setcontactPerson] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
      const {
    data: { user },
  } = await supabase.auth.getUser();

    e.preventDefault();
    setLoading(true);

    const addedUser = await fetch("http://localhost:3000/welcome/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:user?.email,
        role:role,
        companyName:companyName,
        contactInfo:{
          phone: phone,
          address:address,
          contactPerson:contactPerson
        }
      }),
    });
    
    router.push('/home')

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your role below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='role'>Role</FieldLabel>
                <Input
                  id='role'
                  type='text'
                  placeholder='m@example.com'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='companyName'>Company Name</FieldLabel>
                <Input
                  id='companyName'
                  type='text'
                  placeholder='m@example.com'
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
                    placeholder='m@example.com'
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
                    placeholder='m@example.com'
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
                    placeholder='m@example.com'
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
