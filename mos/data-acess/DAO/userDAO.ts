"use server";

import { registerBrandSchema, registerManufacturerSchema } from "@/lib/schemas";
import { authCheck, authenticateUser } from "../auth-user";
import { redirect } from "next/navigation";
import z from "zod";
import prisma from "@/lib/prisma";

export type UserDTO = {
  name: string;
  email: string;
  role: string;
  avatar: string;
};
export async function getUserData(): Promise<UserDTO> {
  const userInfo = await authCheck();
  return {
    name: userInfo.supabaseUser.user_metadata.full_name,
    email: userInfo.supabaseUser.email!,
    role: userInfo.userData?.role!,
    avatar: userInfo.supabaseUser.user_metadata.avatar_url,
  };
}
export async function registerNewBrand(
  data: z.infer<typeof registerBrandSchema>,
) {
  const { supabaseUser } = await authenticateUser();
  await prisma.user.create({
    data: {
      id: supabaseUser.id,
      role: "BRAND",
      brand: {
        create: {
          warehouseAddress: data.warehouseAddress,
          contactNo1: data.contactNo1,
          contactNo2: data.contactNo2 || "",
          rankId: "ascecabbbf-4ad8-4a6c-b5b0-58bfa81413de",
        },
      },
    },
  });
  redirect("/home");
}

export async function registerNewManufacturer(
  data: z.infer<typeof registerManufacturerSchema>,
) {
  const { supabaseUser } = await authenticateUser();
  await prisma.user.create({
    data: {
      id: supabaseUser.id,
      role: "MANUFACTURER",
      manufacturer: {
        create: {
          limitPerOrder: Number(data.limitPerOrder),
          factoryAddress: data.factoryAddress,
          contactNo1: data.contactNo1,
          contactNo2: data.contactNo2 || "",
          rankId: "ascecabbbf-4ad8-4a6c-b5b0-58bfa81413de",
        },
      },
    },
  });
  redirect("/home");
}

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function deleteUser() {
  const { supabaseUser } = await authenticateUser();
  await prisma.user.delete({
    where: { id: supabaseUser.id },
  });
  await supabaseAdmin.auth.admin.deleteUser(supabaseUser.id);
  const cookieStore = await cookies();

  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  redirect("/login");
}
