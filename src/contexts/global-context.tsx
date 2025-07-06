"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

type LevelStatus = "completed" | "in-progress" | "locked"

interface Level {
  level: number
  title: string
  description: string
  status: LevelStatus
}

interface GlobalContextType {
  isMobile: boolean
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (isCollapsed: boolean) => void
  levels: Level[]
  completeLevel: (levelNumber: number) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

const initialLevels: Level[] = [
  {
    level: 1,
    title: "Replay & Take Notes",
    description: "Find what hits you in the video.",
    status: "completed",
  },
  {
    level: 2,
    title: "Write & Reflect",
    description: "Journal your insights into clarity.",
    status: "completed",
  },
  {
    level: 3,
    title: "Connect & Match",
    description: "A new way to meet, match, and grow with purpose-driven peers.",
    status: "in-progress",
  },
  {
    level: 4,
    title: "Act",
    description: "Take a small, meaningful action.",
    status: "locked",
  },
  {
    level: 5,
    title: "Team Up",
    description: "Gain insights from others.",
    status: "locked",
  },
  {
    level: 6,
    title: "Test Yourself",
    description: "Show your progress to inspire others.",
    status: "locked",
  },
  {
    level: 7,
    title: "Mentor & Complete",
    description: "Get verified by your team.",
    status: "locked",
  },
]

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [levels, setLevels] = useState<Level[]>(initialLevels)

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

  const completeLevel = (levelNumber: number) => {
    setLevels(prevLevels => {
      const newLevels = prevLevels.map(level => {
        if (level.level === levelNumber) {
          return { ...level, status: "completed" as LevelStatus }
        }
        if (level.level === levelNumber + 1 && level.status === "locked") {
          return { ...level, status: "in-progress" as LevelStatus }
        }
        return level
      })
      return newLevels
    })
  }

  return (
    <GlobalContext.Provider
      value={{
        isMobile,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        levels,
        completeLevel,
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