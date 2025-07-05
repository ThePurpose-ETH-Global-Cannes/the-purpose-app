'use client'

import { useState } from 'react'
import { Menu, X, Plus, Map, LayoutDashboard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [error, setError] = useState('')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isValidYouTubeUrl = (url: string) => {
    if (!url.trim()) return true // Empty URL is valid (no error)
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+(&[\w=]*)?$/
    return youtubeRegex.test(url.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setYoutubeUrl(value)
    
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
    
    // Show error for invalid URLs (but not for empty input)
    if (value.trim() && !isValidYouTubeUrl(value)) {
      setError('invalid_url')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!youtubeUrl.trim()) {
      setError('Please paste a valid YouTube URL')
      return
    }
    
    if (!isValidYouTubeUrl(youtubeUrl)) {
      setError('invalid_url')
      return
    }
    
    // Handle valid YouTube URL submission
    console.log('YouTube URL:', youtubeUrl)
    setError('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Image
                src="/Logo.png"
                alt="The Purpose"
                width={20}
                height={20}
                className="rounded-full"
              />
            </div>
            <span className="font-semibold text-lg">The Purpose</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
            0
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMenu} />
      )}

      {/* Sidebar */}
      <div className={`overflow-x-clip fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Image
                  src="/Logo.png"
                  alt="The Purpose"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <span className="font-semibold text-lg">The Purpose</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2 p-4 overflow-x-clip">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-left font-normal"
            >
              <Plus className="h-5 w-5" />
              Try a new transformation
            </Button>
            
            <div className="py-2">
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
                <Map className="h-4 w-4" />
                Journeys
              </div>
              <div className="ml-7 pl-3 border-l border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 text-left font-normal text-sm"
                >
                  <User className="h-4 w-4" />
                  Kshipra Dhame I A comprehensive show...
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-left font-normal"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
              O
            </div>
            <span className="font-medium">Otto G</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-4">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to<br />
              The Purpose
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Turn YouTube insights into Action
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="Paste YouTube video URL ..."
                value={youtubeUrl}
                onChange={handleInputChange}
                className={`w-full h-12 pl-4 pr-4 text-base border-2 focus:ring-accent/20 rounded-lg bg-background/50 backdrop-blur-sm ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-accent/50 focus:border-accent'
                }`}
              />
            </div>
            
            {error && (
              <div className="w-full max-w-md mx-auto">
                {error === 'invalid_url' ? (
                  <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-4 text-left">
                    <div className="text-purple-400 font-medium text-sm mb-2">
                      Please paste a valid YouTube URL in one of these formats:
                    </div>
                    <div className="space-y-1 text-purple-300 text-sm font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-500">›</span>
                        <span>https://www.youtube.com/watch?v=...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-500">›</span>
                        <span>https://youtu.be/...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-4 text-center">
                    <div className="text-purple-400 font-medium text-sm">
                      {error}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <footer className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ThemeToggle />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            © 2025 The Purpose. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.744-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </Button>
          </div>
        </footer>
      </main>
    </div>
  )
}