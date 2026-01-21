import { createClient } from "@/utils/supabase/server";
import prisma from "./prisma";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    //the user is not authenticated to use the platform
    return null;
  }
  // Fetch enriched user from DB (e.g. roles, profile)
  const dbUser = await prisma.user.findUnique({
    where: { email: user?.email },
  });

  if (!dbUser) {
    //the user is authenticated but not authorized yet (not completed the needed info to use the platform)
    return {supaUser: user};
  } else {
    return {
      supaUser: user,
      dbUser: {
        ...dbUser,
        contactInfo: JSON.parse(
          dbUser.contactInfo?.toString() || "no info provided",
        ),
      },
    };
  }
}
