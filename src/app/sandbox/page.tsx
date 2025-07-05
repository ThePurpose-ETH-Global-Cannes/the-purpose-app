"use client"

import { useState } from "react";
import { Journey } from "@/components/journey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SandboxPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/watch?v=t3q5hCv_Kyo");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (youtubeUrl) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    const videoId = new URL(youtubeUrl).searchParams.get("v");
    return (
      <main className="min-h-screen">
        <Journey videoId={videoId || ""} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-4 space-y-4">
        <h1 className="text-3xl font-bold text-center">Get Insights from YouTube</h1>
        <div className="flex gap-2">
          <Input 
            type="url"
            placeholder="Paste YouTube URL here..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSubmit}>Get Insights</Button>
        </div>
      </div>
    </main>
  );
}
