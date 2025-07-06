"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useGlobal } from "@/contexts/global-context"

export interface SidebarItem {
  icon?: LucideIcon
  label: string
  onClick?: () => void
  isActive?: boolean
  isDisabled?: boolean
  level?: number
}

interface SidebarProps {
  items: SidebarItem[]
  footer?: React.ReactNode
  defaultCollapsed?: boolean
  className?: string
}

export function Sidebar({
  items,
  footer,
  defaultCollapsed = true,
  className,
}: SidebarProps) {
  const { isMobile, isSidebarCollapsed, setIsSidebarCollapsed } = useGlobal()

  useEffect(() => {
    const checkMobile = () => {
      if (isMobile) {
        setIsSidebarCollapsed(true)
      } else {
        setIsSidebarCollapsed(defaultCollapsed)
      }
    }
    checkMobile()
  }, [isMobile, setIsSidebarCollapsed, defaultCollapsed])

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay with transition */}
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 z-40",
            isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          onClick={() => setIsSidebarCollapsed(true)}
        />
        {/* Sidebar panel with transition */}
        <aside
          className={cn(
            "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] bg-background transition-transform duration-300 ease-in-out border-r",
            isSidebarCollapsed ? "-translate-x-full" : "translate-x-0",
            "w-full max-w-xs"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="space-y-1 px-2">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (item.isDisabled) return
                      if (item.onClick) item.onClick()
                      setIsSidebarCollapsed(true)
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium",
                      item.isActive && !item.isDisabled
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                      !item.isDisabled && "transition-colors hover:text-foreground hover:bg-accent/50",
                      item.isDisabled && "opacity-50",
                      item.level === 2 && "pl-8"
                    )}
                  >
                    {item.icon && <div className="flex-shrink-0"><item.icon className="h-4 w-4" /></div>}
                    <span className="ml-3 truncate overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Footer */}
            {footer && (
              <div className="border-t p-4">
                {footer}
              </div>
            )}
          </div>
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "h-screen bg-background transition-all duration-300 overflow-hidden border-r flex-shrink-0",
        isSidebarCollapsed ? "w-0" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        {!isSidebarCollapsed && (
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.isDisabled) return
                    if (item.onClick) item.onClick()
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium",
                    item.isActive && !item.isDisabled
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground",
                    !item.isDisabled && "transition-colors hover:text-foreground hover:bg-sidebar-accent/50",
                    item.isDisabled && "opacity-50",
                    item.level === 2 && "pl-8"
                  )}
                >
                  {item.icon && <div className="flex-shrink-0"><item.icon className="h-4 w-4" /></div>}
                  {!isSidebarCollapsed && (
                    <span className="ml-3 truncate overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Footer */}
        {!isSidebarCollapsed && footer && (
          <div className="border-t p-4">
            {footer}
          </div>
        )}
      </div>
    </aside>
  )
} 