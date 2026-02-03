"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Boxes,
  Command,
  Factory,
  Frame,
  GalleryVerticalEnd,
  Map,
  MoonIcon,
  PieChart,
  Settings2,
  SquareTerminal,
  UserCircle,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToogleBtn/ThemeToogleBtn";
import { useUser } from "@/providers/user-provider";

// This is sample data.

export function AppSidebar() {
  const { user } = useUser();
  const data = {
    team: {
      name: "Khonsu.MOS",
      logo: MoonIcon,
    },
    navMain: [
      {
        title: "Orders",
        url: "home/orders",
        icon: Boxes,
      },
      {
        title: "Manufacturers",
        url: "/home/manufacturers",
        icon: Factory,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
      },
    ],
  };
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center'>
          <TeamSwitcher team={data.team} />
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
