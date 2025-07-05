import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'



interface UserProfile {
  id: number
  name: string
  avatar?: string
  sharedInsights: string[]
  sharedGoals: string[]
  bio: string
  picture: string
}

interface DiscoveryFeedProps {
  setStep: () => void
}

export default function DiscoveryFeed({ setStep }: DiscoveryFeedProps) {
  const router = useRouter()
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Mock user profiles data
  const userProfiles: UserProfile[] = [
    {
      id: 1,
      name: "Purpose Seeker 123",
      sharedInsights: ["Mindfulness for Stress Reduction", "Building Daily Habits"],
      sharedGoals: ["Improve Focus", "Start a Side Project"],
      bio: "Looking to connect with others who are passionate about personal growth and mindfulness practices.",
      picture: '/discovery-feed/user-2.jpg'
    },
    {
      id: 2,
      name: "Growth Enthusiast",
      sharedInsights: ["Time Management Techniques", "Goal Setting Strategies"],
      sharedGoals: ["Improve Focus", "Build Better Habits"],
      bio: "Entrepreneur seeking accountability partners for productivity and goal achievement.",
      picture: '/discovery-feed/user-1.jpg'
    },
    {
      id: 3,
      name: "Mindful Achiever",
      sharedInsights: ["Personal Growth Mindset", "Mindfulness for Stress Reduction"],
      sharedGoals: ["Start a Side Project", "Improve Work-Life Balance"],
      bio: "Balancing career growth with personal wellness. Love discussing strategies for sustainable success.",
      picture: '/discovery-feed/user-3.jpg'
    }
  ]

  const currentProfile = userProfiles[currentProfileIndex]

  const handleConnect = () => {
    setIsAnimating(true)
    setTimeout(() => {
      console.log('Connected with:', currentProfile.name)
      nextProfile()
    }, 300)
  }

  const handleSkip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      console.log('Skipped:', currentProfile.name)
      nextProfile()
    }, 300)
  }

  const nextProfile = () => {
    if (currentProfileIndex < userProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1)
    } else {
      // Navigate to connection requests when no more profiles
      // router.push('/level3/connections')
      setStep()
    }
    setIsAnimating(false)
  }

  const handleViewDetails = () => {
    // In a real app, this would show a detailed modal
    console.log('View details for:', currentProfile.name)
  }

  if (!currentProfile) {
    return (
      <div className="journaling-container py-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">No More Profiles</h2>
          <p className="text-zinc-400 mb-6">You&apos;ve seen all available connections for now. Check back later for new matches!</p>
          <button
            onClick={() => router.push('/level3/connections')}
            className="primary-button"
          >
            View Your Connections
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold mt-2">Discovery Feed</h2>
      </div>

      {/* Profile Card */}
      <div className="max-w-sm mx-auto px-4">
        <Card
          className={`bg-card border-border p-6 mb-8 !gap-1 transition-transform duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
          onClick={handleViewDetails}
        >
          {/* Avatar and Name */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-zinc-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Image src={currentProfile.picture} alt="Profile" width={80} height={80} className="w-full h-full object-cover rounded-full" />
              {/* <User className="w-10 h-10 text-zinc-400" /> */}
            </div>
            <h3 className="text-xl font-semibold">{currentProfile.name}</h3>
          </div>

          {/* Shared Insights */}
          <div className="mb-6">
            <h4 className="text-purple-400 font-medium mb-3 text-center">SHARED INSIGHTS</h4>
            <div className="space-y-2">
              {currentProfile.sharedInsights.map((insight, index) => (
                <div key={index} className="text-center text-sm">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Shared Goals */}
          <div className="mb-6">
            <h4 className="text-purple-400 font-medium mb-3 text-center">SHARED GOALS</h4>
            <div className="space-y-2">
              {currentProfile.sharedGoals.map((goal, index) => (
                <div key={index} className="text-center text-sm">
                  {goal}
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="text-center text-sm text-zinc-300">
            {currentProfile.bio}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handleSkip}
            disabled={isAnimating}
            className="flex items-center justify-center w-16 h-16 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors disabled:opacity-50"
          >
            <X className="w-8 h-8 text-zinc-300" />
          </button>
          <button
            onClick={handleConnect}
            disabled={isAnimating}
            className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Heart className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center text-sm text-zinc-500">
          {currentProfileIndex + 1} of {userProfiles.length}
        </div>
      </div>
    </div>
  )
}

