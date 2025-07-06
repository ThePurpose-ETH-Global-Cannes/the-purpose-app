'use client'

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Level3 } from "@/components/level-3"
import { useState } from "react"
import { Button } from "../ui/button"

const Dialog = DialogPrimitive.Root
const DialogPortal = DialogPrimitive.Portal
const DialogOverlay = DialogPrimitive.Overlay
const DialogContent = DialogPrimitive.Content
const DialogClose = DialogPrimitive.Close
const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

const maxStepsInLevel = 3

export function Level3Modal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [step, setStep] = useState(1)
    const progressValue = (step / maxStepsInLevel) * 100

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />
                <DialogContent
                    className={cn(
                        "fixed inset-0 z-50 flex flex-col bg-background",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
                    )}
                >
                    <header className="p-4 border-b shrink-0">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                             <DialogClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-5 w-5" />
                                </Button>
                            </DialogClose>
                        </div>
                        <div className="mt-4 max-w-2xl mx-auto">
                            <DialogTitle asChild>
                                <h2 className="text-lg font-bold">Level 3: Connect & Match</h2>
                            </DialogTitle>
                            <DialogDescription asChild>
                                <p className="text-sm text-muted-foreground">How to Build Better Habits</p>
                            </DialogDescription>
                            <div className="flex items-center gap-2 mt-2">
                                <Progress value={progressValue} className="h-1.5" />
                                <span className="text-sm text-muted-foreground">{step}/{maxStepsInLevel}</span>
                            </div>
                        </div>
                    </header>
                    <Level3 step={step} setStep={setStep} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
} 