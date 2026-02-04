"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string;
    logo: React.ElementType;
  };
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(team);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Link href='/home'>
              <SidebarMenuButton
                size='lg'
                className=' data-[state=open]:text-sidebar-accent-foreground'
              >
                <img
                  src='/icon.jpg'
                  width={40}
                  height={40}
                  alt='icon'
                  className='rounded-full'
                />
                <div className=' flex text-center text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {activeTeam.name}
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
