import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    redirect(`${baseURL}/login`);
  }
  return { supabaseUser: user, isAuthenticated: true };
};

//cheeks if the user is authorized
//if not it will redirect to welcome page to complete profile
export const authorizeUser = async (authenticatedUserId: string) => {
  const userData = await prisma.user.findUnique({
    where: { id: authenticatedUserId },
  });
  if (userData === null) {
    redirect(`${baseURL}/register`);
  }
  return { userData, isAuthorized: true };
};

//used to cheek on the current user if authenticated and authorized
//if any of them not satisfied it will redirect to login page or welcome page
export const authCheck = async () => {
  const { supabaseUser, isAuthenticated } = await authenticateUser();
  console.log("supabaseUser", supabaseUser);

  const { userData, isAuthorized } = await authorizeUser(supabaseUser.id);
  console.log("supabaseUser", supabaseUser);

  return { supabaseUser, userData, isAuthorized, isAuthenticated };
};

// softer check that doesn't redirect
export const getCurrentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return { supabaseUser: user, userData };
};
