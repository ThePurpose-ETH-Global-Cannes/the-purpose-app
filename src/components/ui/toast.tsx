"use client"

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "bg-background text-foreground border-border",
        duration: 3000,
      }}
    />
  )
}

interface ToastProps {
  title?: string
  message: string
  type?: "default" | "success" | "error" | "loading"
}

const styles = {
  success: {
    icon: "✓",
    className: "border-l-4 border-l-success text-success",
  },
  error: {
    icon: "✕", 
    className: "border-l-4 border-l-destructive text-destructive",
  },
  loading: {
    icon: "◌",
    className: "border-l-4 border-l-muted-foreground animate-pulse",
  },
  default: {
    icon: "ℹ",
    className: "border-l-4 border-l-primary",
  },
}

function showToast(message: string, type: "default" | "success" | "error" | "loading" = "default", title?: string) {
  const { icon, className } = styles[type]

  sonnerToast(message, {
    icon,
    className,
    ...(title && { description: message, title }),
  })
}

export const toast = Object.assign(
  ({ title, message, type = "default" }: ToastProps) => showToast(message, type, title),
  {
    error: (message: string, title?: string) => showToast(message, "error", title),
    success: (message: string, title?: string) => showToast(message, "success", title),
    loading: (message: string, title?: string) => showToast(message, "loading", title),
  }
)