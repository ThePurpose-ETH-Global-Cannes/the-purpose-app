import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
// import { CoachingSession, Options } from "@/types/api/journey"

type Options = {
  id: string | number
  label: string
}

type CoachingSession = {
  options: Options[]
}

interface OptionSelectorProps {
    options: Options[];
    selectedOptions: Options[];
    onChange: (newSelectedOptions: CoachingSession['options']) => void;
    title?: string;
    description?: string;
    className?: string;
    optionClassName?: string;
    selectedOptionClassName?: string;
    unselectedOptionClassName?: string;
    iconSize?: "sm" | "md" | "lg";
    disabled?: boolean;
    mode?: 'single' | 'multiple' | 'limited';
    maxSelections?: number;
}

export function OpinionSelector({
    options,
    selectedOptions,
    onChange,
    title,
    description,
    className,
    optionClassName,
    selectedOptionClassName,
    unselectedOptionClassName,
    iconSize = "md",
    disabled = false,
    mode = "multiple",
    maxSelections = 3
}: OptionSelectorProps) {
    if (typeof options !== 'object' || options.length === 0) return null

    const getIconSize = () => {
        switch (iconSize) {
            case "sm": return "h-4 w-4"
            case "lg": return "h-6 w-6"
            default: return "h-5 w-5"
        }
    }

    const getVariantClasses = (isSelected: boolean) => {
        return isSelected
            ? cn("bg-primary/10 border-primary", selectedOptionClassName)
            : cn("bg-card border-border hover:border-primary/50", unselectedOptionClassName)
    }

    const isSelected = (id: string | number) => {
        if (!selectedOptions) return false;

        return selectedOptions.some(option => option.id === id);
    }

    const handleOptionClick = (id: string | number) => {
        if (disabled) return;

        const option = options.find(opt => opt.id === id);
        if (!option) return;

        const alreadySelected = isSelected(id);

        switch (mode) {
            case 'single': {
                if (!alreadySelected) {
                    onChange([option]);
                }
                break;
            }

            case 'multiple': {
                let newSelected: CoachingSession['options'];
                if (alreadySelected) {
                    newSelected = selectedOptions.filter(o => o.id !== id);
                } else {
                    newSelected = [...selectedOptions, option];
                }
                onChange(newSelected);
                break;
            }

            case 'limited': {
                if (alreadySelected) {
                    const newSelected = selectedOptions.filter(o => o.id !== id);
                    onChange(newSelected);
                } else {
                    if (maxSelections === undefined || selectedOptions.length < maxSelections) {
                        const newSelected = [...selectedOptions, option];
                        onChange(newSelected);
                    }
                }
                break;
            }
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {title && <h2 className="font-medium text-accent">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}

            {options.map((option) => {
                const selected = isSelected(option.id);

                return (
                    <div
                        key={option.id}
                        className={cn(
                            "flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                            getVariantClasses(selected),
                            disabled && "opacity-50 cursor-not-allowed",
                            optionClassName
                        )}
                        onClick={() => handleOptionClick(option.id)}
                    >
                        <div className="mt-0.5">
                            {selected ? (
                                <CheckCircle className={cn("text-primary", getIconSize())} />
                            ) : (
                                <Circle className={cn("text-muted-foreground", getIconSize())} />
                            )}
                        </div>
                        <p className="text-foreground">{option.label}</p>
                    </div>
                )
            })}
        </div>
    )
}
