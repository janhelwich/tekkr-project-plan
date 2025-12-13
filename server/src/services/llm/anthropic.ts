import Anthropic from "@anthropic-ai/sdk";
import { Message } from "../../domain/chat";
import { LLMProvider } from "./provider";

export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor(model: string = "claude-sonnet-4-20250514") {
    this.client = new Anthropic();
    this.model = model;
  }

  async generateResponse(messages: Message[]): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: `You are a helpful assistant. When the user asks for a "project plan", you should respond with a structured project plan using the following XML format embedded in your response:

<project-plan>
{
  "workstreams": [
    {
      "title": "Workstream Title",
      "description": "Description of the workstream",
      "deliverables": [
        {
          "title": "Deliverable Title",
          "description": "Description of the deliverable"
        }
      ]
    }
  ]
}
</project-plan>

You can include text before and after the project plan. The project plan can appear anywhere in your response.`,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Anthropic");
    }

    return textBlock.text;
  }
}
