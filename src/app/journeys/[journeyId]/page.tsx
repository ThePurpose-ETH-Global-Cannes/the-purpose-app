'use client'

import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabConfig } from "@/components/ui/tabs";
import { YoutubeEmbed } from "@/components/journey/youtube-embed";
import { MainLayout } from '@/components/layout/main-layout'

type JourneyState = "analyzing" | "loading" | "content";

const MOCKED_DATA_FULL = `
### ZK Identity Verification
Verify user attributes (age, nationality) on-chain without revealing sensitive data using zero-knowledge proofs.

### Self Protocol
Leverages existing biometric passports/IDs
`

export default function JourneyPage({ params }: { params: { journeyId: string } }) {
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
      <div className="w-full h-full flex flex-col items-center justify-center pt-24">
        <h1 className="text-2xl font-bold tracking-tight mb-4 text-center">
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
        content: (
            <div className="mt-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Key Concepts</h2>
                    <Button>Now Set Your Goal</Button>
                </div>
                <Markdown content={streamedContent} />
            </div>
        )
    },
    {
        value: "goals",
        label: "Goals",
        content: <p className="mt-6 text-muted-foreground">Goals will appear here.</p>
    },
    {
        value: "insights",
        label: "Insights",
        content: <p className="mt-6 text-muted-foreground">Insights will appear here.</p>
    }
  ]

  return (
    <MainLayout>
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">
                Remi Colin I Verify Identities Onchain Using Self SDK I ETHGlobal Cannes 2025
            </h1>
            <Button variant="outline" size="sm" onClick={() => setShowVideo(!showVideo)} className="mb-4">
                {showVideo ? 'Hide Video' : 'Show Video'}
            </Button>
            {showVideo && <YoutubeEmbed embedId={params.journeyId} />}

            <div className="my-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold bg-primary/20 text-primary px-2 py-1 rounded-full">✨ 1 XP</span>
                    <Progress value={14} className="w-full" />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">0/7 Levels Complete</span>
                </div>
            </div>
            
            <Tabs tabs={tabs} defaultValue="key-concepts" />
        </div>
    </MainLayout>
  );
} 