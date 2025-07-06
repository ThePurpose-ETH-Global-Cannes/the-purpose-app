"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

interface GlobalContextProps {
  isMobile: boolean
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (isCollapsed: boolean) => void
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setIsSidebarCollapsed(true)
      }
    }

    // Initial check
    checkDevice()
    
    // Add event listener with debounce
    let timeoutId: NodeJS.Timeout
    const debouncedCheck = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkDevice, 100)
    }

    window.addEventListener("resize", debouncedCheck)
    return () => {
      window.removeEventListener("resize", debouncedCheck)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isMobile,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider")
  }
  return context
} 