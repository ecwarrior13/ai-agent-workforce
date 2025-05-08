import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { google } from '@ai-sdk/google';

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    const { messages, modelId, systemPrompt, provider, submittedInputs } = await req.json();

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
        case "google":
            model = google(modelId);
            break;
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!model) {
        throw new Error("Failed to initialize model");
    }

    console.log("Request data:", {
        messages,
        systemPrompt,
        submittedInputs,
        modelId,
        provider
    });

    // Create an enhanced system prompt that includes the submitted inputs
    const enhancedSystemPrompt = submittedInputs && Object.keys(submittedInputs).length > 0
        ? `${systemPrompt}\n\nUser provided the following information:\n${Object.entries(submittedInputs)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}`
        : systemPrompt;

    console.log("Enhanced system prompt:", enhancedSystemPrompt);

    const result = streamText({
        model,
        messages,
        system: enhancedSystemPrompt,
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

