import prisma from '../lib/prisma'
import { UserModel} from '@/app/generated/prisma/models/User'
import { createClient } from './supabase/server'
export async function getLoggedInUser(): Promise< UserModel | null> {
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

  return loggedInUser || null;
}
