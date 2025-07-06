"use client"

import { ReactNode } from "react"
import {
  LayoutDashboard,
  Map,
  Plus,
  User,
} from "lucide-react"

import { Sidebar, SidebarItem } from "@/components/ui/sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const sidebarItems: SidebarItem[] = [
    {
      icon: Plus,
      label: "Try a new transformation",
      onClick: () => console.log("New transformation"),
    },
    {
      level: 1,
      icon: Map,
      label: "Journeys",
    },
    {
      level: 2,
      icon: User,
      label: "Kshipra Dhame I A comprehensive show...",
      onClick: () => console.log("Journey clicked"),
      isActive: true,
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => console.log("Dashboard"),
    },
  ]

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header />
        <main className="flex-1 pt-6 px-4 sm:px-6 lg:px-8 w-full min-w-0 overflow-x-hidden">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 