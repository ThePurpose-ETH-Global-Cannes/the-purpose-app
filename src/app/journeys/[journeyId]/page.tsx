'use client'

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation'
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabConfig } from "@/components/ui/tabs";
import { YoutubeEmbed } from "@/components/journey/youtube-embed";
import { MainLayout } from '@/components/layout/main-layout'
import { Lightbulb, Target, Sparkles, Users } from "lucide-react";

type JourneyState = "analyzing" | "loading" | "content";

const MOCKED_DATA_FULL = `
### ZK Identity Verification
Verify user attributes (age, nationality) on-chain without revealing sensitive data using zero-knowledge proofs.

### Self Protocol
Leverages existing biometric passports/IDs
`

export default function JourneyPage() {
  const params = useParams()
  const journeyId = params.journeyId as string

  const [state, setState] = useState<JourneyState>("analyzing");
  const [showVideo, setShowVideo] = useState(true);
  const [streamedContent, setStreamedContent] = useState("");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setState("loading");
    }, 2000);

    const timer2 = setTimeout(() => {
      setState("content");
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (state === 'content') {
      const words = MOCKED_DATA_FULL.split(/(\s+)/);
      let currentContent = "";
      words.forEach((word, index) => {
        setTimeout(() => {
          currentContent += word;
          setStreamedContent(currentContent);
        }, index * 50);
      });
    }
  }, [state]);

  const renderLoadingState = (text: string) => (
    <MainLayout>
      <div className="w-full h-full flex flex-col items-center justify-center pt-24 px-4">
        <h1 className="text-2xl font-bold tracking-tight mb-4 text-center max-w-full">
            Remi Colin I Verify Identities Onchain Using Self SDK I ETHGlobal Cannes 2025
        </h1>
        <LoadingSpinner text={text} />
      </div>
    </MainLayout>
  );

  if (state === "analyzing") {
    return renderLoadingState("Analyzing video...");
  }

  if (state === "loading") {
    return renderLoadingState("Loading journey...");
  }
  
  const tabs: TabConfig[] = [
    {
        value: "key-concepts",
        label: "Key Concepts",
        icon: <Lightbulb className="w-4 h-4" />,
        content: (
            <div className="mt-6 w-full max-w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold">Key Concepts</h2>
                    <Button className="w-full sm:w-auto">Now Set Your Goal</Button>
                </div>
                <Markdown content={streamedContent} className="mt-4 w-full max-w-full overflow-x-hidden" />
            </div>
        )
    },
    {
        value: "goals",
        label: "Goals",
        icon: <Target className="w-4 h-4" />,
        content: <p className="mt-6 text-muted-foreground">Goals will appear here.</p>
    },
    {
        value: "transformation",
        label: "Transformation",
        icon: <Sparkles className="w-4 h-4" />,
        content: <p className="mt-6 text-muted-foreground">Transformation will appear here.</p>
    },
    {
        value: "community",
        label: "Community",
        icon: <Users className="w-4 h-4" />,
        content: <p className="mt-6 text-muted-foreground">Community will appear here.</p>
    }
  ]

  return (
    <MainLayout>
      <div className="w-full max-w-full overflow-x-hidden">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 break-words">
            Remi Colin I Verify Identities Onchain Using Self SDK I ETHGlobal Cannes 2025
        </h1>
        <Button variant="outline" size="sm" onClick={() => setShowVideo(!showVideo)} className="mb-4">
            {showVideo ? 'Hide Video' : 'Show Video'}
        </Button>
        {showVideo && (
          <div className="w-full max-w-full overflow-hidden">
            <YoutubeEmbed embedId={journeyId} />
          </div>
        )}

        <div className="my-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full bg-purple-600/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
                              <span className="text-2xl">✨</span>
                          </div>
                      </div>
                      <div className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                          1
                      </div>
                  </div>
                </div>
                <div className="w-full min-w-0 flex-1">
                    <Progress value={14} className="h-2.5" />
                    <p className="text-sm text-muted-foreground mt-2 text-right">0/7 Levels Complete</p>
                </div>
            </div>
        </div>
        
        <div className="w-full max-w-full overflow-x-hidden border-t border-border pt-4 mt-4">
          <Tabs tabs={tabs} defaultValue="key-concepts" />
        </div>
      </div>
    </MainLayout>
  );
} 