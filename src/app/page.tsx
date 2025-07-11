'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { usePrivy } from '@privy-io/react-auth'
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MainLayout } from '@/components/layout/main-layout'

const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e|embed)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

interface VideoMetadata {
  url: string;
  title: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  version: string;
  width: number;
  height: number;
  type: string;
  html: string;
}

export default function Home() {
  const { ready, authenticated, login } = usePrivy()
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [error, setError] = useState('')
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false)
  const router = useRouter()

  const isValidYouTubeUrl = (url: string) => {
    if (!url.trim()) return true; // Empty URL is valid (no error)
    return getYouTubeVideoId(url) !== null;
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      if (isValidYouTubeUrl(youtubeUrl) && youtubeUrl.trim()) {
        setIsFetchingMetadata(true)
        setVideoMetadata(null)
        setError('')
        try {
          const response = await fetch(
            `https://noembed.com/embed?url=${youtubeUrl}`,
          )
          const data = await response.json()
          if (data.error) {
            setError(
              'Could not fetch video details. The video might be private or deleted.',
            )
            setVideoMetadata(null)
          } else {
            setVideoMetadata(data)
          }
        } catch (e) {
          console.error('Failed to fetch video metadata:', e)
          setError('Failed to fetch video metadata.')
          setVideoMetadata(null)
        } finally {
          setIsFetchingMetadata(false)
        }
      } else {
        setVideoMetadata(null)
        if (youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl)) {
          setError('invalid_url')
        } else {
          setError('')
        }
      }
    }

    const handler = setTimeout(() => {
      if (youtubeUrl.trim()) {
        fetchMetadata()
      } else {
        setVideoMetadata(null)
        setError('')
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [youtubeUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoMetadata || !isValidYouTubeUrl(youtubeUrl)) {
      if (!youtubeUrl.trim()) {
        setError('Please paste a valid YouTube URL')
      } else {
        setError('invalid_url')
      }
      return
    }
    
    const videoId = getYouTubeVideoId(youtubeUrl);
    if (videoId) {
      fetch('/api/youtube-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: youtubeUrl }),
      }).catch(err => {
        // We can log this to a service later
        console.error("Error calling transcript API:", err)
      })

      router.push(`/journeys/${videoId}`)
    } else {
      setError('Could not extract video ID from the URL.')
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <header className="absolute top-0 flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/Logo.png"
              alt="The Purpose"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-transparent bg-clip-text whitespace-nowrap">
              The Purpose
            </span>
          </div>
          <Button variant="ghost" onClick={login}>
            Sign In
          </Button>
        </header>
        <div className="text-center">
          <h1 className="text-5xl font-bold">Welcome to The Purpose</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Start your journey with us
          </p>
          <Button
            onClick={login}
            className="mt-8 bg-purple-600 px-8 py-3 text-lg text-white hover:bg-purple-700"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to<br />
            The Purpose Web3
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Turn YouTube insights into Action
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              type="url"
              placeholder="Paste YouTube video URL ..."
              value={youtubeUrl}
              onChange={handleInputChange}
              className={`text-center text-lg border-2 shadow-sm transition-all h-12 w-full dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-600 dark:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400'
              }`}
            />
            <Button
              type="submit"
              className="w-full sm:w-auto bg-purple-600 px-8 py-3 text-lg text-white hover:bg-purple-700 h-12 flex-shrink-0"
              disabled={isFetchingMetadata || !youtubeUrl.trim() || !!error}
            >
              Get Insights
            </Button>
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

        {isFetchingMetadata && <div className="mt-8"><LoadingSpinner text="Getting video details..." /></div>}

        {videoMetadata && (
          <div className="w-full max-w-3xl mx-auto mt-8 space-y-4 text-left animate-fade-in">
            <div className="aspect-video overflow-hidden rounded-lg shadow-lg border border-purple-500/20">
              <div
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                dangerouslySetInnerHTML={{ __html: videoMetadata.html }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{videoMetadata.title}</h2>
              <p className="text-muted-foreground mt-1">
                by{' '}
                <a
                  href={videoMetadata.author_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  {videoMetadata.author_name}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}