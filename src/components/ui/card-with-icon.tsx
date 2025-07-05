import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardWithIconProps {
    icon: LucideIcon
    title: string
    content: string
    iconClassName?: string
    cardClassName?: string
    contentClassName?: string
    titleClassName?: string
    iconBackgroundClassName?: string
    iconSize?: "sm" | "md" | "lg"
}

export function CardWithIcon({
    icon: Icon,
    title,
    content,
    iconClassName,
    cardClassName,
    contentClassName,
    titleClassName,
    iconBackgroundClassName,
    iconSize = "md",
}: CardWithIconProps) {
    const getIconSize = () => {
        switch (iconSize) {
            case "sm":
                return "h-4 w-4"
            case "lg":
                return "h-6 w-6"
            default:
                return "h-5 w-5"
        }
    }

    return (
        <Card className={cn("bg-card border-border", cardClassName)}>
            <CardContent className="px-6 py-3">
                <div className="flex items-start space-x-4">
                    <div className={cn("bg-primary/20 rounded-full p-2", iconBackgroundClassName)}>
                        <Icon className={cn("text-primary", getIconSize(), iconClassName)} />
                    </div>
                    <div className="space-y-2">
                        <h3 className={cn("font-medium text-lg text-foreground", titleClassName)}>{title}</h3>
                        <p className={cn("text-muted-foreground", contentClassName)}>{content}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 