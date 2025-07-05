import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: number
}

export function LoadingSpinner({
  className,
  size = 48
}: LoadingSpinnerProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className={cn("animate-spin", className)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            "conic-gradient(from 90deg at 50% 50%, rgba(139, 92, 246, 0) 0%, rgb(139, 92, 246) 100%)",
          WebkitMask: `radial-gradient(farthest-side, #0000 calc(100% - ${
            size / 6
          }px), #000 0)`,
          mask: `radial-gradient(farthest-side, #0000 calc(100% - ${
            size / 6
          }px), #000 0)`
        }}
      />
    </div>
  )
} 
