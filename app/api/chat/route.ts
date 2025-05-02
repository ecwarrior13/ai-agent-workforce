import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { createOpenRouter } from '@openrouter/ai-sdk-provider';



const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    const { messages, modelId, systemPrompt, provider } = await req.json();


    let model;
    switch (provider) {
        case "claude":
            model = anthropic(modelId);
            break;
        case "openai":
            model = openai(modelId);
            break;
        case "openrouter":
            model = openRouter(modelId);
            break;
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!model) {
        throw new Error("Failed to initialize model");
    }

    const result = streamText({
        model,
        messages,
        system: systemPrompt,
    })

    return result.toDataStreamResponse({
        getErrorMessage: (error) => {
            console.error("Server-side error:", error);
            if (error instanceof Error) {
                return `${error.name}: ${error.message}`;
            }
            return String(error);
        },
    });



}

