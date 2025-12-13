import ReactMarkdown from "react-markdown";
import { ProjectPlan, ProjectPlanData } from "./project-plan";

interface MessageContentProps {
  content: string;
}

type ContentSegment =
  | { type: "text"; content: string }
  | { type: "project-plan"; data: ProjectPlanData };

function parseContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  // More lenient regex: handles whitespace around tags and tag names
  const regex = /<\s*project-plan\s*>([\s\S]*?)<\s*\/\s*project-plan\s*>/gi;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the project plan
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim();
      if (textBefore) {
        segments.push({ type: "text", content: textBefore });
      }
    }

    // Parse and add the project plan
    try {
      const jsonContent = match[1].trim();
      const data = JSON.parse(jsonContent) as ProjectPlanData;
      segments.push({ type: "project-plan", data });
    } catch (e) {
      console.error("Failed to parse project plan JSON:", e);
      // If JSON parsing fails, treat it as text
      segments.push({ type: "text", content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last project plan
  if (lastIndex < content.length) {
    const textAfter = content.slice(lastIndex).trim();
    if (textAfter) {
      segments.push({ type: "text", content: textAfter });
    }
  }

  // If no project plans found, return the whole content as text
  if (segments.length === 0) {
    segments.push({ type: "text", content });
  }

  return segments;
}

export function MessageContent({ content }: MessageContentProps) {
  const segments = parseContent(content);

  return (
    <div className="w-full">
      {segments.map((segment, index) => {
        if (segment.type === "project-plan") {
          return <ProjectPlan key={index} data={segment.data} />;
        }
        return (
          <div
            key={index}
            className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-3"
          >
            <ReactMarkdown>{segment.content}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
