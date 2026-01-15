import prisma from '../lib/prisma'
import { UserModel} from '@/app/generated/prisma/models/User'
import { createClient } from './supabase/server'
import { User } from '@supabase/supabase-js'
export async function getLoggedInUser(): Promise< {supaUser: User, dbUser: UserModel}> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!loggedInUser) {
    await prisma.user.create({
      data: {
        id: user?.id!,
        email: user?.email!,
        name: user?.user_metadata.full_name || 'No Name',
      },
    });
  }

  return {supaUser: user!, dbUser: loggedInUser!};
}
