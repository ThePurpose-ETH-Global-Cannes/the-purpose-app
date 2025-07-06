interface YoutubeEmbedProps {
    embedId: string;
}

export function YoutubeEmbed({ embedId }: YoutubeEmbedProps) {
  return (
    <div className="relative w-full max-w-full aspect-video overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${embedId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
} 