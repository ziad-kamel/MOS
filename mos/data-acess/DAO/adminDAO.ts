"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createAdminSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getAdmins() {
  return await prisma.admin.findMany({
    include: {
      user: true,
    },
  });
}

export async function createAdmin(data: z.infer<typeof createAdminSchema>) {
  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      user_metadata: { full_name: data.name },
      email_confirm: true,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Failed to create auth user");
  }

  // 2. Create User and Admin in Prisma
  try {
    const newUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        role: "ADMIN",
        admin: {
          create: {},
        },
      },
    });

    revalidatePath("/home/admins");
    return newUser;
  } catch (error) {
    // Cleanup auth user if prisma creation fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

export async function deleteAdmin(id: string) {
  // Deleting the user will cascade delete the admin record
  await prisma.user.delete({
    where: { id: id },
  });

  await supabaseAdmin.auth.admin.deleteUser(id);

  revalidatePath("/home/admins");
}
