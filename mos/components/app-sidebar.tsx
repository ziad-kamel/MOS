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
  ShieldAlert,
  Trophy,
  ShieldXIcon,
  ShieldUser,
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
        url: "/home/orders",
        icon: Boxes,
      },
    ],
  };
  if (
    user?.role === "BRAND" ||
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
  ) {
    data.navMain.push({
      title: "Manufacturers",
      url: "/home/manufacturers",
      icon: Factory,
    });
  }
  if (user?.role === "SUPER_ADMIN") {
    data.navMain.push({
      title: "Brands",
      url: "/home/brands",
      icon: UserCircle,
    });
    data.navMain.push({
      title: "Admins",
      url: "/home/admins",
      icon: ShieldUser,
    });
  }
  if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
    data.navMain.push({
      title: "Ranks",
      url: "/home/ranks",
      icon: Trophy,
    });
  }
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
