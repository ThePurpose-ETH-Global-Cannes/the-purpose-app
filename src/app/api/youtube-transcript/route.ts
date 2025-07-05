import { YoutubeTranscript } from "youtube-transcript"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json(
      { error: "Missing videoId parameter" },
      { status: 400 }
    )
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    return NextResponse.json(transcript)
  } catch (error) {
    console.error("Error fetching transcript:", error)
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    )
  }
} 