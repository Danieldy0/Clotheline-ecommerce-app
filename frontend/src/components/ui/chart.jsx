import * as React from "react"
import { Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef(({ config, children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex aspect-video justify-center text-xs", className)}
            {...props}
        >
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = Tooltip

const ChartTooltipContent = React.forwardRef(({ active, payload, className, indicator = "dot" }, ref) => {
    if (!active || !payload?.length) {
        return null
    }

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border bg-background p-2 shadow-md",
                className
            )}
        >
            <div className="grid gap-1.5">
                {payload.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        {indicator === "dot" && (
                            <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                        )}
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-mono font-medium">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
