"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface TabConfig {
  value: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
  isDisabled?: boolean
}

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  tabs: TabConfig[]
  className?: string
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ tabs, className, ...props }, ref) => {
  const tabListRef = React.useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = React.useState(false)
  const [showRightScroll, setShowRightScroll] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    const el = tabListRef.current
    if (!el) return

    const hasOverflow = el.scrollWidth > el.clientWidth
    const atStart = el.scrollLeft <= 0
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth

    setShowLeftScroll(hasOverflow && !atStart)
    setShowRightScroll(hasOverflow && !atEnd)
  }, [])

  React.useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = tabListRef.current
    if (!el) return

    const scrollAmount = el.clientWidth * 0.8
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const handleScroll = () => {
    checkScroll()
  }

  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    >
      <div className="relative">
        <div className="flex items-center">
          <div
            className="relative w-full overflow-hidden px-8"
            onScroll={handleScroll}
          >
            <TabsPrimitive.List
              ref={tabListRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tabs.map((tab) => (
                <TabsPrimitive.Trigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.isDisabled}
                  className={cn(
                    tab.isDisabled ? "pointer-events-none opacity-50" : "",
                    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
                    "text-muted-foreground hover:text-foreground/80",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </TabsPrimitive.Trigger>
              ))}
            </TabsPrimitive.List>
          </div>
          {(showLeftScroll || showRightScroll) && (
            <Button
              variant="ghost"
              size="icon"
              className="vnzk-left-scroll absolute left-0 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {(showLeftScroll || showRightScroll) && (
            <Button
              variant="ghost"
              size="icon"
              className="vnzk-right-scroll absolute right-0 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
})

Tabs.displayName = TabsPrimitive.Root.displayName

export { Tabs } 