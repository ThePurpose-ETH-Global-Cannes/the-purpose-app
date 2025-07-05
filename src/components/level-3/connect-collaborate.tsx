
import React, { useState } from 'react'
import { CheckCircle, Circle } from "lucide-react"
import { Card } from '@/components/ui/card'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

const maxLength = 100

interface ConnectCollaborateProps {
  setStep: () => void
}

export default function ConnectCollaborate({ setStep }: ConnectCollaborateProps) {
  const [discoverabilityEnabled, setDiscoverabilityEnabled] = useState(true)
  const [highlightKeyGoal, setHighlightKeyGoal] = useState(true)
  const [selectedInsights, setSelectedInsights] = useState<number[]>([])
  const [bio, setBio] = useState('')

  const availableInsights = [
    { id: 1, text: "Mindfulness for Stress Reduction" },
    { id: 2, text: "Building Daily Habits" },
    { id: 3, text: "Time Management Techniques" },
    { id: 4, text: "Goal Setting Strategies" },
    { id: 5, text: "Personal Growth Mindset" }
  ]

  const handleInsightToggle = (insightId: number) => {
    if (selectedInsights.includes(insightId)) {
      setSelectedInsights(selectedInsights.filter(id => id !== insightId))
    } else if (selectedInsights.length < 3) {
      setSelectedInsights([...selectedInsights, insightId])
    }
  }

  const handleSetupProfile = () => {
    console.log('Profile setup:', {
      discoverabilityEnabled,
      highlightKeyGoal,
      selectedInsights,
      bio
    })

    setStep()
  }

  const getIconSize = (iconSize: "sm" | "md" | "lg" = "md") => {
    switch (iconSize) {
      case "sm": return "h-4 w-4"
      case "lg": return "h-6 w-6"
      case "md": return "h-5 w-5"
      default: return "h-5 w-5"
    }
  }

  return (
    <div className="journaling-container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Connect & Collaborate</h1>
        <p className="text-center mb-8 text-zinc-400">
          Level 3 is all about starting to find like-minded individuals for growth and collaboration towards the Goal.
        </p>

        <div className="space-y-8">

          <Card className="bg-card border-border px-3 md:px-6 !gap-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Select discoverability preferences</h3>
                <p className="text-sm text-zinc-400">Allow others to find and connect with you</p>
              </div>
              <button
                onClick={() => setDiscoverabilityEnabled(!discoverabilityEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${discoverabilityEnabled ? 'bg-purple-600' : 'bg-zinc-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${discoverabilityEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Highlight Key Goal</h3>
                <p className="text-sm text-zinc-400">Show your primary goal to potential connections</p>
              </div>
              <button
                onClick={() => setHighlightKeyGoal(!highlightKeyGoal)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highlightKeyGoal ? 'bg-purple-600' : 'bg-zinc-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highlightKeyGoal ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </Card>

          <Card className="bg-card border-border px-3 md:px-6">
            <h3 className="text-lg font-medium ">SHOWCASE TOP INSIGHTS</h3>
            <p className="text-sm text-zinc-400 ">Select up to 3 insights to highlight (selected: {selectedInsights.length}/3)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableInsights.map(insight => (
                <div
                  key={insight.id}
                  onClick={() => handleInsightToggle(insight.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedInsights.includes(insight.id)
                    ? cn("bg-primary/10 border-primary")
                    : cn("bg-card border-border hover:border-primary/70")
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{insight.text}</span>

                    {selectedInsights.includes(insight.id) ? (
                      <CheckCircle className={cn("text-primary", getIconSize('sm'))} />
                    ) : (
                      <Circle className={cn("text-muted-foreground", getIconSize('sm'))} />
                    )}

                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-card border-border px-3 md:px-6">
            <h3 className="text-lg font-medium">Brief BIO for connection</h3>
            <Textarea
              mode="simple"
              label=""
              placeholder="Write a short bio about what you hope to gain from connecting with others..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={maxLength}
            />
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleSetupProfile}
              disabled={selectedInsights.length === 0}
              className="primary-button text-base p-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Set Up Your Connection Profile
            </Button>
          </div>
        </div>
      </div >
    </div >
  )
}

