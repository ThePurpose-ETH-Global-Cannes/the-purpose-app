import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ContentCardProps {
    title?: string
    content: React.ReactNode
    className?: string
    contentClassName?: string
    titleClassName?: string
    padding?: "sm" | "md" | "lg"
}

export function ContentCard({
    title,
    content,
    className,
    contentClassName,
    titleClassName,
    padding = "md",
}: ContentCardProps) {
    const getPadding = () => {
        switch (padding) {
            case "sm":
                return "p-2"
            case "lg":
                return "p-6"
            default:
                return "p-4"
        }
    }

    return (
        <Card className={cn("bg-card border-border", className)}>
            <CardContent className={cn(getPadding(), contentClassName)}>
                {title && (
                    <h3 className={cn("font-medium text-foreground mb-2", titleClassName)}>{title}</h3>
                )}
                <div className="text-foreground">{content}</div>
            </CardContent>
        </Card>
    )
} 