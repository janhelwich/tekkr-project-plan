import OpenAI from "openai";
import { Message } from "../../domain/chat";
import { LLMProvider } from "./provider";

export class OpenAIProvider implements LLMProvider {
  readonly name = "openai";
  private client: OpenAI;
  private model: string;

  constructor(model: string = "gpt-4o") {
    this.client = new OpenAI();
    this.model = model;
  }

  async generateResponse(messages: Message[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. When the user asks for a "project plan", you should respond with a structured project plan using the following XML format embedded in your response:

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
        },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No text response from OpenAI");
    }

    return content;
  }
}
