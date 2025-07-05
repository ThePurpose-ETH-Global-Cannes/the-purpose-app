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
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 pt-6">{children}</main>
      </div>
    </div>
  )
} 