"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

import { useGlobal } from "@/contexts/global-context"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"

export function Header() {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useGlobal()

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <header className="sticky top-0 z-50 w-full max-w-full bg-background flex items-center h-16 px-4 border-b overflow-x-hidden">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden h-8 w-8 -ml-2 p-0 flex-shrink-0"
        >
          {isSidebarCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Image
            src="/Logo.png"
            alt="The Purpose"
            width={24}
            height={24}
            className="object-contain flex-shrink-0"
          />
          <Link href="/" className="min-w-0 flex-1">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-transparent bg-clip-text truncate block">
              The Purpose
            </span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <UserNav />
      </div>
    </header>
  )
} 