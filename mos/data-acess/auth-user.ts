import { createClient } from "@/utils/supabase/server";
import { redirect, RedirectType } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const authenticateUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    NextResponse.redirect(`${baseURL}/login`);
  }
  return { user, isAuthenticated: true };
};

export const authCheck = async () => {
  const { user, isAuthenticated } = await authenticateUser();
  if (!isAuthenticated || !user) {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/login`);
  }
  return user;
};
