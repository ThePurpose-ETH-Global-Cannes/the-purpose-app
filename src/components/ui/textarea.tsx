import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { useState } from "react"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  disabled?: boolean
  mode?: "simple" | "form"
  label?: string
  isEditing?: boolean
  onEdit?: () => void
  onSave?: (text: string) => void
  onCancel?: () => void
  saveDisabled?: boolean
  errorMessage?: string
  maxLength?: number
  value?: string
}

function Textarea({
  className,
  disabled,
  mode = "simple",
  label,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  saveDisabled = false,
  errorMessage,
  value,
  maxLength,
  ...props
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [isEditingInternal, setIsEditingInternal] = useState(isEditing)


  const handleOnEdit = () => {
    setIsEditingInternal(true)
    onEdit?.()
  }
  const handleOnSave = () => {
    setIsEditingInternal(false)
    onSave?.(textareaRef.current?.value || "")
  }
  const handleOnCancel = () => {
    setIsEditingInternal(false)
    onCancel?.()
  }

  React.useEffect(() => {
    if (isEditingInternal && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditingInternal])


  if (mode === "simple") {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={textareaRef}
          disabled={disabled}
          value={value}
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
            {
              "opacity-50 cursor-not-allowed": disabled,
            },
            className
          )}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && <CharacterCounter valueLength={value?.length || 0} maxLength={maxLength || 0} />}
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    )
  }

  // Form mode
  return (
    <div className="space-y-2">
      {!isEditingInternal ? (
        <>
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-foreground">{value}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOnEdit}
              className="mt-2 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
              disabled={disabled}
            >
              Edit
            </Button>
          </div>
          {maxLength && <CharacterCounter valueLength={value?.length || 0} maxLength={maxLength || 0} />}
        </>
      ) : (
        <>
          <textarea
            ref={textareaRef}
            disabled={disabled}
            value={value}
            className={cn(
              "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
              {
                "opacity-50 cursor-not-allowed": disabled,
              },
              className
            )}
            maxLength={maxLength}
            {...props}
          />
          {maxLength && <CharacterCounter valueLength={value?.length || 0} maxLength={maxLength || 0} />}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleOnCancel}
              className="mr-2 border-border hover:bg-muted"
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOnSave}
              disabled={saveDisabled || disabled}
            >
              Save
            </Button>
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  )
}

export { Textarea }

const CharacterCounter = ({ valueLength, maxLength }: { valueLength: number, maxLength: number }) => (
  <div className="flex justify-between items-center -mt-1.5">
    <span />
    <span className="text-muted-foreground">({valueLength}/{maxLength}) characters</span>
  </div>
)
