import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { ThemeToggle } from "../ThemeToogleBtn/ThemeToogleBtn"
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Separator } from "../ui/separator"

export async function AppSidebar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user);
    
  return (
    <Sidebar>
      <SidebarHeader >
        <div className="flex justify-between items-center p-1">
            <Link href="/home">
        <img src="icon.jpg" alt="" width={40} height={40} className="rounded-full"/>
            </Link>
        <ThemeToggle/>
        </div>
      </SidebarHeader>
      <div className="p-2">
      <Separator className=""/>
      </div>

      <SidebarContent >
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <div className="p-2">
      <Separator className=""/>
      </div>
      <SidebarFooter>
        <ProfileDropdown user={user!}/>
      </SidebarFooter>
    </Sidebar>
  )
}