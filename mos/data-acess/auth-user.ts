import { createClient } from "@/utils/supabase/server";
import { redirect, RedirectType } from "next/navigation";
import { UserRole } from "@/app/generated/prisma/enums";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

//cheeks if the user is authenticated
//if not it will redirect to login page
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

//cheeks if the user is authorized
//if not it will redirect to welcome page to complete profile
export const authorizeUser = async () => {
  const { user, isAuthenticated } = await authenticateUser();
  if (!isAuthenticated || !user) {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/login`);
  }
  const userData = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!userData) {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/welcome`);
  }
  return { userData, isAuthorized: true };
};

//used to cheek on the current user if authenticated and authorized
//if any of them not satisfied it will redirect to login page or welcome page
export const authCheck = async () => {
  const { user, isAuthenticated } = await authenticateUser();
  if (!isAuthenticated || !user) {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/login`);
  }
  const { userData, isAuthorized } = await authorizeUser();
  if (!isAuthorized || !userData) {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/welcome`);
  }
  return { user, userData, isAuthorized, isAuthenticated };
};
