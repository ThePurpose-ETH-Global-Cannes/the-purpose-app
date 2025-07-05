"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InlineTextEditorProps {
    text: string
    onSave: (newText: string) => Promise<void>
    onCancel?: () => void
    className?: string
    placeholder?: string
    saveOnEnter?: boolean
}

export function InlineTextEditor({
    text,
    onSave,
    onCancel,
    className,
    placeholder = "Enter text...",
    saveOnEnter = false,
}: InlineTextEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const inputRef = useRef<HTMLSpanElement>(null)

    // Reset content when text prop changes or editing is cancelled
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.textContent = text || placeholder
        }
    }, [text, placeholder, isEditing])

    const handleSave = async () => {
        const newText = inputRef.current?.textContent?.trim() || ''
        if (newText === text) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await onSave(newText)
            setIsEditing(false)
        } catch (error) {
            console.error('Error saving text:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (inputRef.current) {
            inputRef.current.textContent = text || placeholder
        }
        setIsEditing(false)
        if (onCancel) {
            onCancel()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && saveOnEnter) {
            e.preventDefault()
            handleSave()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    return (
        <div className={cn("group flex items-center gap-2", className)}>
            <span
                ref={inputRef}
                contentEditable={isEditing}
                onKeyDown={handleKeyDown}
                onBlur={(e) => {
                    // Prevent blur if clicking save/cancel buttons
                    if (e.relatedTarget?.closest('.edit-actions')) return
                    handleCancel()
                }}
                className={cn(
                    "flex-1 outline-none",
                    isEditing && "border-b-1 border-primary"
                )}
                suppressContentEditableWarning
            >
                {text || placeholder}
            </span>
            <div className="edit-actions flex items-center gap-1">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="p-1 hover:text-primary transition-colors"
                            aria-label="Save"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="p-1 hover:text-primary transition-colors"
                            aria-label="Cancel"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                        aria-label="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
} 