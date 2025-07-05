interface YoutubeEmbedProps {
    embedId: string;
}

export function YoutubeEmbed({ embedId }: YoutubeEmbedProps) {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${embedId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
    </div>
  );
} 