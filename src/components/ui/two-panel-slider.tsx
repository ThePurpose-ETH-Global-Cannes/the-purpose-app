"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useGlobal } from "@/contexts/global-context"
import { GripHorizontal, GripVertical } from "lucide-react"
interface TwoPanelSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  firstPanel: React.ReactNode
  secondPanel: React.ReactNode
  /** Direction of the split. On mobile, automatically switches to vertical */
  direction?: "horizontal" | "vertical"
  /** Size of first panel in percentage (0-100). Use 0 or 100 to collapse panels */
  splitSize?: number
  /** Called when user drags the splitter */
  onSplitChange?: (size: number) => void
  className?: string,
  allowDrag?: boolean
}

export function TwoPanelSlider({
  firstPanel,
  secondPanel,
  direction = "horizontal",
  splitSize = 50,
  onSplitChange,
  className,
  allowDrag = true,
  ...props
}: TwoPanelSliderProps) {
  const { isMobile } = useGlobal()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  // Force vertical layout on mobile
  const isVertical = isMobile || direction === "vertical"

  // Handle drag events
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!allowDrag) return
    e.preventDefault()
    setIsDragging(true)
    document.body.style.userSelect = "none"
  }

  const handleDrag = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const pos = 'touches' in e ? e.touches[0] : e

      // Calculate new split percentage
      const newSize = isVertical
        ? ((pos.clientY - rect.top) / rect.height) * 100
        : ((pos.clientX - rect.left) / rect.width) * 100

      // Clamp between 0 and 100
      const clampedSize = Math.max(0, Math.min(100, newSize))
      onSplitChange?.(clampedSize)
    },
    [isDragging, isVertical, onSplitChange]
  )

  const handleDragEnd = () => {
    setIsDragging(false)
    document.body.style.userSelect = ""
  }

  // Add and remove drag listeners
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag)
      window.addEventListener("touchmove", handleDrag)
      window.addEventListener("mouseup", handleDragEnd)
      window.addEventListener("touchend", handleDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag)
      window.removeEventListener("touchmove", handleDrag)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging, handleDrag])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative gap-2",
        isVertical ? "flex flex-col" : "flex",
        className
      )}
      {...props}
    >
      {/* First Panel */}
      <div
        className={cn(
          "relative overflow-hidden",
          isVertical
            ? "w-full transition-[height] duration-200"
            : "h-full transition-[width] duration-200",
          splitSize === 0 && "hidden"
        )}
        style={{
          [isVertical ? "height" : "width"]: `${splitSize}%`,
        }}
      >
        {firstPanel}
      </div>
      {/* Resizer handle */}
      <div
        className={cn(
          "flex items-center justify-center shrink-0",
          isVertical
            ? "h-1 w-full hover:bg-accent"
            : "w-1 h-full hover:bg-accent",
          allowDrag ? (
            isVertical ? "cursor-row-resize" : "cursor-col-resize"
          ) : "cursor-default",
          (splitSize === 0 || splitSize === 100) && "hidden"
        )}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Resize icon */}
        {allowDrag && (
        <div className={cn("absolute text-foreground/60",)}>
          {isVertical ? (
            <GripHorizontal size={16} />
          ) : (
            <GripVertical size={16} />
          )}
        </div>
        )}

        {/* Divider line */}
        <div className={cn(
          "absolute bg-border/40",
          isVertical
            ? "h-[1px] w-full"
            : "w-[1px] h-full"
        )} />
        


      </div>

      {/* Second Panel */}
      <div
        className={cn(
          "relative overflow-hidden",
          isVertical
            ? "w-full transition-[height] duration-200"
            : "h-full transition-[width] duration-200",
          splitSize === 100 && "hidden"
        )}
        style={{
          [isVertical ? "height" : "width"]: `${100 - splitSize}%`,
        }}
      >
        {secondPanel}
      </div>
    </div>
  )
}

export default TwoPanelSlider 