import { cn } from "@/lib/utils"
import * as React from "react"

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  color?: "default" | "destructive" | "warning"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, color = "default", ...props }, ref) => {
    const getColorClass = () => {
      switch (color) {
        case "destructive":
          return "bg-destructive"
        case "warning":
          return "bg-yellow-500"
        default:
          return "bg-primary"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 transition-all", getColorClass())}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
