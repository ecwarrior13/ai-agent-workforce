"use client";

import { sideBarMenuItems } from "@/config/nav";
import Logo from "../Logo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";

//import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
//import { DynamicNavMain } from "./dynamicNavMain";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isCollapsed: boolean;
}

export function DashboardSidebar({
  isCollapsed,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-secondary/20">
        <div className="flex items-center space-x-2">
          <Logo
            collapsed={isCollapsed}
            className="w-full"
            fontSize={isCollapsed ? "2xl" : "3xl"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-secondary/20">
        {/* <DynamicNavMain items={sideBarMenuItems.navMain} /> */}
        <NavMain items={sideBarMenuItems.navMain} />
        <NavProjects projects={sideBarMenuItems.projects} />
      </SidebarContent>
      <SidebarFooter className="bg-secondary/20">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
