"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { authCheck, authenticateUser } from "../auth-user";
import { revalidatePath } from "next/cache";
import { UserRole } from "@/app/generated/prisma/enums";
import { UserModel } from "@/app/generated/prisma/models";
import { createClient, User } from "@supabase/supabase-js";
import z from "zod";
import { registerUserSchema } from "@/lib/schemas";

export interface UserDTO {
  email: string;
  name: string;
  role: UserRole | null;
  avatar: string;
  companyName: string;
  contactInfo: {
    phone: string;
    address: string;
    contactPerson: string;
  };
}
//converts user data from db and supabase to userDTO to handel in the UI
const convertUser = (user: UserModel, authUser: User) => {
  return {
    email: authUser.email!,
    name: authUser.user_metadata.full_name,
    role: user.role,
    avatar: authUser.user_metadata.avatar_url,
    companyName: user.companyName,
    contactInfo: {
      phone: JSON.parse(user.contactInfo?.toString()!).phone,
      address: JSON.parse(user.contactInfo?.toString()!).address,
      contactPerson: JSON.parse(user.contactInfo?.toString()!).contactPerson,
    },
  };
};

//fetch current logged in user data from db and supabase (after check on the user authentication and authorization)
export async function getUserData() {
  const { user, userData } = await authCheck();
  console.log("user data", userData);
  return convertUser(userData, user);
}

//fetch all users data from db (after check on the user authentication and authorization)
export async function getAllUsers() {
  await authCheck();
  const users = await prisma.user.findMany();
  return users;
}

//update user data in db (after check on the user authentication and authorization)
export async function updateUserData(newData: {
  companyName: string;
  contactInfo: { phone: string; address: string; contactPerson: string };
}) {
  const {
    user: { email: currentUserEmail },
  } = await authCheck();
  await prisma.user.update({
    where: { email: currentUserEmail },
    data: {
      companyName: newData.companyName,
      contactInfo: JSON.stringify({
        phone: newData.contactInfo.phone,
        address: newData.contactInfo.address,
        contactPerson: newData.contactInfo.contactPerson,
      }),
    },
  });

  //to trigger a UI update after the database is changed.
  // revalidatePath("/profile");
}

//delete user from db and supabase (after check on the user authentication and authorization)
export async function deleteUser() {
  try {
    const supabase = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const {
      user: { email: currentUserEmail, id },
    } = await authCheck();
    await prisma.user.delete({
      where: { email: currentUserEmail },
    });
    const { data, error } = await supabase.auth.admin.deleteUser(id);
  } catch (error) {
    throw new Error("error while deleting user");
  } finally {
    const cookieStore = (await import("next/headers")).cookies();
    const cookiesToClear = (await cookieStore)
      .getAll()
      .filter((c) => c.name.startsWith("sb-"));
    cookiesToClear.forEach(async (c) => (await cookieStore).delete(c.name));
  }

  revalidatePath("/profile");
}

export type registerUserData = z.infer<typeof registerUserSchema>;

export async function registerNewUser(data: registerUserData) {
  const { user } = await authenticateUser();
  await prisma.user.create({
    data: {
      email: user?.email!,
      role: data.role,
      companyName: data.companyName,
      contactInfo: JSON.stringify({
        phone: data.contactInfo.phone,
        address: data.contactInfo.address,
        contactPerson: data.contactInfo.contactPerson,
      }),
    },
  });
  redirect("/profile");
}
