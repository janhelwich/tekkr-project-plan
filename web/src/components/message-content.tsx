import ReactMarkdown from "react-markdown";

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-3">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
