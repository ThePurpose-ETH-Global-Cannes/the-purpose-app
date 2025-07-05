"use client"

import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabConfig } from "@/components/ui/tabs";
import { YoutubeEmbed } from "./youtube-embed";

type JourneyState = "analyzing" | "loading" | "content";

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

const MOCKED_DATA = `
### ZK Identity Verification
Verify user attributes (age, nationality) on-chain without revealing sensitive data using zero-knowledge proofs.

### Self Protocol
Leverages existing biometric passports/IDs
`

export function Journey({ videoId }: { videoId: string }) {
  const [state, setState] = useState<JourneyState>("analyzing");
  const [showVideo, setShowVideo] = useState(true);
  const [insights, setInsights] = useState<TranscriptItem[] | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setState("loading");
    }, 2000); // 2 seconds for analyzing

    const timer2 = setTimeout(() => {
      setState("content");
    }, 4000); // 2 more seconds for loading

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getInsights = async () => {
    setLoadingInsights(true);
    try {
      console.log("🎬 Fetching transcript for videoId:", videoId);
      const response = await fetch(`/api/youtube-transcript?videoId=${videoId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch transcript: ${errorData.error}`);
      }
      
      const data = await response.json();
      setInsights(data);
      
      console.log("📜 --- YOUTUBE TRANSCRIPT EXCERPT ---");
      console.log("📊 Total transcript items:", data.length);
      
      // Log first paragraph (first 10 items or until we have a good amount of text)
      const excerpt = data.slice(0, 10).map((item: TranscriptItem) => item.text).join(" ");
      console.log("📝 First paragraph:", excerpt);
      
      // Log the full first 5 items with timestamps
      console.log("⏱️ First 5 items with timestamps:");
      data.slice(0, 5).forEach((item: TranscriptItem, index: number) => {
        console.log(`${index + 1}. [${item.offset}s] ${item.text}`);
      });
      
      console.log("📜 --- END YOUTUBE TRANSCRIPT EXCERPT ---");
      
    } catch (error) {
      console.error("❌ Error fetching insights:", error);
    } finally {
        setLoadingInsights(false);
    }
  };

  if (state === "analyzing") {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-lg text-muted-foreground">Analyzing video...</p>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-lg text-muted-foreground">Loading journey...</p>
      </div>
    );
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
                <Markdown content={MOCKED_DATA} />
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
        content: (
            <div className="mt-6">
                <Button onClick={getInsights} disabled={loadingInsights}>
                    {loadingInsights ? <LoadingSpinner size={20} className="mr-2" /> : null}
                    Get Insights
                </Button>
                {insights && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Transcript Excerpt</h3>
                        <div className="max-h-60 overflow-y-auto bg-muted/40 p-4 rounded-md text-sm">
                            {insights.slice(0, 20).map((item: TranscriptItem, index: number) => (
                                <p key={index}>{item.text}</p>
                            ))}
                             {insights.length > 20 && <p className="text-center mt-2">...</p>}
                        </div>
                    </div>
                )}
            </div>
        )
    }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
       <h1 className="text-2xl font-bold tracking-tight mb-4">
            Remi Colin I Verify Identities Onchain Using Self SDK I ETHGlobal Cannes 2025
       </h1>
        <Button variant="outline" size="sm" onClick={() => setShowVideo(!showVideo)} className="mb-4">
            {showVideo ? 'Hide Video' : 'Show Video'}
        </Button>
      {showVideo && <YoutubeEmbed embedId={videoId} />}

      <div className="my-6">
        <div className="flex items-center gap-4">
            <span className="text-sm font-bold bg-primary/20 text-primary px-2 py-1 rounded-full">✨ 1 XP</span>
            <Progress value={14} className="w-full" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">0/7 Levels Complete</span>
        </div>
      </div>
      
      <Tabs tabs={tabs} defaultValue="key-concepts" />
    </div>
  );
} 