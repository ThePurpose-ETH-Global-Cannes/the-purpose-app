import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ConnectionRequest {
  id: number
  name: string
  message: string
  avatar?: string
}

interface MutualMatch {
  id: number
  name: string
  avatar?: string
}

interface ConnectionProps {
  setStep: (step: number) => void
}

export default function Connections({ setStep }: ConnectionProps) {

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: 1,
      name: "Jane Doe",
      message: "I'd love to connect!",
      avatar: '/discovery-feed/user-1.jpg'
    },
    {
      id: 2,
      name: "Michael Smith",
      message: "Founder & CEO",
      avatar: '/discovery-feed/user-5.jpg'

    },
    {
      id: 3,
      name: "Sarah Davis",
      message: "Working in marketing",
      avatar: '/discovery-feed/user-3.jpg'
    }
  ])

  const [mutualMatches, setMutualMatches] = useState<MutualMatch[]>([
    {
      id: 1,
      name: "Andrew Wilson",
      avatar: '/discovery-feed/user-4.jpg'
    },
    {
      id: 2,
      name: "Emily Johnson",
      avatar: '/discovery-feed/user-1.jpg'
    }
  ])

  const handleAcceptRequest = (requestId: number) => {
    const request = connectionRequests.find(req => req.id === requestId)
    if (request) {
      setMutualMatches([...mutualMatches, { id: request.id, name: request.name }])
      setConnectionRequests(connectionRequests.filter(req => req.id !== requestId))
    }
  }

  const handleDeclineRequest = (requestId: number) => {
    setConnectionRequests(connectionRequests.filter(req => req.id !== requestId))
  }

  const handleChat = (matchId: number) => {
    console.log('Starting chat with match ID:', matchId)
    alert('Chat functionality would open here!')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-white">Connections & Matches</h1>
      </div>

      <div className="mx-auto px-4">
        {/* Connection Requests Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h2 className="text-xl font-bold mb-4">Connection Requests</h2>

            {connectionRequests.length === 0 ? (
              <div className="text-center text-zinc-400 py-8">
                <p>No pending connection requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {connectionRequests.map((request) => (
                  <Card key={request.id} className={`bg-card border-border rounded-lg p-4 !gap-1 transition-transform duration-300`}>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Image src={request.avatar || '/discovery-feed/user-1.jpg'} alt="User Avatar" className='rounded-full' width={48} height={48} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white">{request.name}</h3>
                        <p className="text-sm text-zinc-400 mt-1">{request.message}</p>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="px-4 py-2 rounded-lg text-sm font-medium  transition-colors cursor-pointer"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleDeclineRequest(request.id)}
                            variant="outline"
                            className="px-4 py-2  rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <h2 className="text-xl font-bold mb-4">Mutual Matches</h2>

            {mutualMatches.length === 0 ? (
              <div className="text-center text-zinc-400 py-8">
                <p>No mutual matches yet</p>
                <p className="text-sm mt-2">Start connecting with others to see your matches here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mutualMatches.map((match) => (
                  <Card key={match.id} className={`bg-card border-border rounded-lg p-4 !gap-1 transition-transform duration-300`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                          <Image src={match.avatar || '/discovery-feed/user-1.jpg'} alt="User Avatar" className='rounded-full' width={48} height={48} />
                        </div>
                        <h3 className="font-medium text-white">{match.name}</h3>
                      </div>
                      <Button
                        onClick={() => handleChat(match.id)}
                        className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid md:grid-cols-2 md:gap-8 gap-4 mt-10">
          <div className="col-span-1">
            <Button
              onClick={() => setStep(2)}
              className="w-full py-6 bg-purple-600 text-base rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Back to Discovery Feed
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant={"secondary"}
              onClick={() => setStep(1)}
              className="w-full py-6 text-base rounded-lg font-medium hover:bg-zinc-600 transition-colors cursor-pointer"
            >
              Edit Connection Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

