import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { Box, CircleUserIcon, Code } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
export default function ProfileDropdown({user}: {user: User}) {
  return (
    
    <DropdownMenu>
            <DropdownMenuTrigger className='border-none hover:bg-secondary rounded-lg'>
        <div className='flex flex-row justify-between items-center p-2'>
            <div className='flex justify-center items-center gap-2'>

            <img src={user.user_metadata.avatar_url} alt="Profile Image" width={35} height={35}  className='rounded-full'/>
            <div className='flex flex-col items-start'>
                <p className='text-xs'>{user.user_metadata.full_name}</p>
                <p className='text-xs'>{user.email}</p>
            </div>
            </div>
            <Code size={'14'} className='rotate-90'/>
        </div>
            </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
         <CircleUserIcon/>
         Profile
         </DropdownMenuItem>
    <DropdownMenuItem>
        <Box/>
        Orders
        </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
        <Link href="/auth/signout" className='w-full'>
        signout
        </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
  )
}
