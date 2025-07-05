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
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => {
      window.removeEventListener("resize", checkDevice)
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