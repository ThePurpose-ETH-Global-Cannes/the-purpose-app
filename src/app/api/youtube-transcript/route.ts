import { type NextRequest, NextResponse } from "next/server"

/* eslint-disable @typescript-eslint/no-explicit-any */

// Simple protobuf-like encoding for YouTube's expected format
function encodeProtobuf(obj: { param1?: string | null; param2?: string }): string {
  // This creates a simple protobuf-encoded buffer
  // Field 1 (param1): string, field 2 (param2): string
  const parts: number[] = []

  if (obj.param1) {
    // Field 1, wire type 2 (length-delimited)
    parts.push(0x0a) // field 1, wire type 2
    parts.push(obj.param1.length)
    for (let i = 0; i < obj.param1.length; i++) {
      parts.push(obj.param1.charCodeAt(i))
    }
  }

  if (obj.param2) {
    // Field 2, wire type 2 (length-delimited)
    parts.push(0x12) // field 2, wire type 2
    parts.push(obj.param2.length)
    for (let i = 0; i < obj.param2.length; i++) {
      parts.push(obj.param2.charCodeAt(i))
    }
  }

  return Buffer.from(parts).toString("base64")
}

function getTranscriptParams(videoId: string, language = "en", trackKind = "asr"): string {
  // First level: encode track kind and language
  const innerParams = encodeProtobuf({
    param1: trackKind === "asr" ? "asr" : null,
    param2: language,
  })

  // Second level: encode video ID and inner params
  const outerParams = encodeProtobuf({
    param1: videoId,
    param2: innerParams,
  })

  return outerParams
}

function extractText(item: any): string {
  if (item?.simpleText) {
    return item.simpleText
  }
  if (item?.runs) {
    return item.runs.map((run: any) => run.text).join("")
  }
  return ""
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

function extractTranscriptFromResponse(data: any, videoId: string): string | null {
  try {
    const actions = data?.actions
    if (!actions || actions.length === 0) {
      console.log("No actions found in response")
      return null
    }

    const transcriptAction = actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer
    if (!transcriptAction) {
      console.log("No transcript renderer found")
      return null
    }

    let initialSegments =
      transcriptAction?.content?.transcriptSearchPanelRenderer?.body?.transcriptSegmentListRenderer?.initialSegments

    if (!initialSegments) {
      initialSegments = transcriptAction?.body?.transcriptBodyRenderer?.cueGroups
    }

    if (!initialSegments || initialSegments.length === 0) {
      console.log("No initial segments found")
      return null
    }

    const transcriptParts: string[] = []

    for (const segment of initialSegments) {
      if (segment.transcriptSegmentRenderer) {
        const { snippet } = segment.transcriptSegmentRenderer
        const text = extractText(snippet)
        if (text && text.trim()) {
          transcriptParts.push(text.trim())
        }
      }
      else if (segment.transcriptSectionHeaderRenderer) {
        const { snippet } = segment.transcriptSectionHeaderRenderer
        const text = extractText(snippet)
        if (text && text.trim()) {
          transcriptParts.push(text.trim())
        }
      }
      else if (segment.transcriptCueGroupRenderer) {
        const cues = segment.transcriptCueGroupRenderer.cues
        if (cues) {
          for (const cue of cues) {
            if (cue.transcriptCueRenderer?.cue) {
              const text = extractText(cue.transcriptCueRenderer.cue)
              if (text && text.trim()) {
                transcriptParts.push(text.trim())
              }
            }
          }
        }
      }
    }

    if (transcriptParts.length === 0) {
      console.log("No transcript parts extracted")
      return null
    }

    const fullTranscript = transcriptParts.join(" ").replace(/\s+/g, " ").trim()

    console.log(`Extracted transcript with ${transcriptParts.length} parts for video ${videoId}`)
    return fullTranscript
  } catch (error) {
    console.error("Error extracting transcript:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json()

    if (!videoUrl) {
      return NextResponse.json({ success: false, message: "Video URL is required" }, { status: 400 })
    }

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return NextResponse.json({ success: false, message: "Invalid YouTube URL format" }, { status: 400 })
    }

    const params = getTranscriptParams(videoId, "en", "asr")

    const payload = {
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20240826.01.00",
        },
      },
      params: params,
    }

    const response = await fetch("https://www.youtube.com/youtubei/v1/get_transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: "https://www.youtube.com",
        Referer: "https://www.youtube.com/",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const transcript = extractTranscriptFromResponse(data, videoId)

    if (!transcript) {
      return NextResponse.json(
        { success: false, message: "No transcription available for this video" },
        { status: 404 },
      )
    }

    // Per your instruction, logging an excerpt to the server console.
    const excerpt = transcript.split(" ").slice(0, 30).join(" ") + "...";
    console.log(`[TRANSCRIPT EXCERPT for ${videoId}]: "${excerpt}"`);

    return NextResponse.json({
      success: true,
      message: "Transcript processing started.",
    })
  } catch (error: any) {
    console.error("Transcription error:", error)

    if (error.message?.includes("403")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Video may be private or restricted." },
        { status: 403 },
      )
    }

    if (error.message?.includes("404")) {
      return NextResponse.json(
        { success: false, message: "Video not found or transcripts not available." },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { success: false, message: "An error occurred while fetching the transcription. Please try again later." },
      { status: 500 },
    )
  }
} 