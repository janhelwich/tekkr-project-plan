import { Message } from "../../domain/chat";
import { LLMProvider } from "./provider";

export class DummyLLMProvider implements LLMProvider {
  readonly name = "dummy";

  async generateResponse(messages: Message[]): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content?.toLowerCase() || "";

    // Check if user is asking for a project plan
    if (
      userMessage.includes("project plan") ||
      userMessage.includes("workstream")
    ) {
      return `Here's a project plan for you:

<project-plan>
{
  "workstreams": [
    {
      "title": "Research & Discovery",
      "description": "Understand the problem space and gather requirements from stakeholders.",
      "deliverables": [
        {
          "title": "User Research Report",
          "description": "Comprehensive analysis of user needs and pain points."
        },
        {
          "title": "Competitive Analysis",
          "description": "Review of existing solutions in the market."
        }
      ]
    },
    {
      "title": "Design & Prototyping",
      "description": "Create visual designs and interactive prototypes for validation.",
      "deliverables": [
        {
          "title": "Wireframes",
          "description": "Low-fidelity layouts for all key screens."
        },
        {
          "title": "High-Fidelity Mockups",
          "description": "Polished visual designs ready for development."
        }
      ]
    },
    {
      "title": "Implementation",
      "description": "Build the solution according to specifications.",
      "deliverables": [
        {
          "title": "MVP Release",
          "description": "Initial working version with core features."
        },
        {
          "title": "Documentation",
          "description": "Technical and user documentation."
        }
      ]
    }
  ]
}
</project-plan>

Let me know if you'd like me to adjust anything!`;
    }

    // Default responses
    const responses = [
      "That's an interesting question! Let me think about it...",
      "I understand what you're asking. Here's my thoughts on that.",
      "Great point! I'd be happy to help with that.",
      `You said: "${lastMessage?.content}". That's a thoughtful message!`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}
