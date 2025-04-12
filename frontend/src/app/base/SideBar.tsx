import React, { useState } from "react"
import Icons from "../../components/icons"
import { Link } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SideBarProps {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  components: {
    title: string
    href: string
    description: string
  }[]
}

const SideBar: React.FC<SideBarProps> = ({ expanded, setExpanded, components }) => {
  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  const closeSidebar = () => {
    setExpanded(false)
  }

  return (
    <SidebarProvider>
      {/* Overlay (visible only when sidebar is open) */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-black  p-4 
          overflow-y-auto 
          w-full max-w-sm     /* or w-64 if you prefer a fixed width */
          transition-transform duration-300 ease-in-out
          ${expanded ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarMenu>
          <div className="mb-4 font-bold text-xl flex items-center justify-between">
            <Link to="/">
              <img src="../assets/Frame 50126812.png" alt="Logo" />
            </Link>
            <button onClick={closeSidebar}>
              <Icons.ArrowLeftToLine size="40" color="white" />
            </button>
          </div>

          {/* Example collapsible items */}
          <Collapsible className="mb-2">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="text-lg">
                  Features <Icons.ChevronDown size="30" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Link to="/item1">Item 1</Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link to="/item2">Item 2</Link>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible className="mb-2">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="text-lg">
                  Applications <Icons.ChevronDown size="30" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Link to="/item3">Item 3</Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link to="/item4">Item 4</Link>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible className="mb-2">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="text-lg">
                  Support <Icons.ChevronDown size="30" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Link to="/item1">Item 1</Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link to="/item2">Item 2</Link>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible className="mb-2">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="text-lg">
                  <Link to="/price">Price</Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
          {/* End of collapsible items example */}

        </SidebarMenu>
      </aside>
    </SidebarProvider>
  )
}

export default SideBar