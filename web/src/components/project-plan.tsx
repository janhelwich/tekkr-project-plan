import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export interface Deliverable {
  title: string;
  description: string;
}

export interface Workstream {
  title: string;
  description: string;
  deliverables: Deliverable[];
}

export interface ProjectPlanData {
  workstreams: Workstream[];
}

interface ProjectPlanProps {
  data: ProjectPlanData;
}

export function ProjectPlan({ data }: ProjectPlanProps) {
  return (
    <div className="my-4 rounded-lg border bg-background">
      <h3 className="px-4 py-3 text-sm font-semibold">Project Workstreams</h3>
      <div className="flex flex-col">
        {data.workstreams.map((workstream, index) => (
          <WorkstreamItem
            key={index}
            workstream={workstream}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function WorkstreamItem({
  workstream,
  index,
}: {
  workstream: Workstream;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const letter = String.fromCharCode(65 + index); // A, B, C, D...

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-t">
        <CollapsibleTrigger className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-accent/50">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {letter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">{workstream.title}</div>
            {!isOpen && (
              <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {workstream.description}
              </div>
            )}
          </div>
          <div className="shrink-0 pt-1">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 ps-16">
            <p className="text-sm text-muted-foreground mb-4">
              {workstream.description}
            </p>

            {workstream.deliverables.length > 0 && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Deliverables</h4>
                  <div className="flex flex-col gap-4">
                    {workstream.deliverables.map((deliverable, idx) => (
                      <DeliverableItem key={idx} deliverable={deliverable} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function DeliverableItem({ deliverable }: { deliverable: Deliverable }) {
  return (
    <div>
      <div className="font-medium text-sm">{deliverable.title}</div>
      <div className="text-sm text-muted-foreground mt-0.5">
        {deliverable.description}
      </div>
    </div>
  );
}
