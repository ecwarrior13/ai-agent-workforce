export interface aiModels {
    aiModelValues?: aiModels[];
    name: string;
    apiModelName: string;
    maxTokens?: string;
    premium: boolean;
    disabled?: boolean;
    image?: boolean
    notes?: string;
    provider: string;
    experimental: boolean;
    sortOrder: number;
    supportsStreaming: boolean;
}


export const aiModelList: aiModels[] = [
    {
        name: "Claude 3.7 Sonnet",
        apiModelName: "claude-3-7-sonnet-20250219",
        maxTokens: "200,000",
        premium: true,
        disabled: false,
        image: true,
        notes: "Latest high-performance model with reasoning capabilities, released February 2025",
        experimental: false,
        provider: "claude",
        sortOrder: 10,
        supportsStreaming: true,
    },
    {
        name: "Claude 3.5 Sonnet",
        apiModelName: "claude-3-5-sonnet-20241022",
        maxTokens: "200,000",
        premium: true,
        disabled: false,
        image: true,
        notes: "Balanced performance model with strong reasoning",
        experimental: false,
        provider: "claude",
        sortOrder: 20,
        supportsStreaming: true,
    },
    {
        name: "Claude 3.5 Haiku",
        apiModelName: "claude-3-5-haiku-20241022",
        maxTokens: "200,000",
        premium: false,
        disabled: false,
        image: true,
        notes: "Fast and efficient model for everyday tasks",
        experimental: false,
        provider: "claude",
        sortOrder: 30,
        supportsStreaming: true,
    },
    {
        name: "GPT-4 Turbo",
        apiModelName: "gpt-4-turbo",
        maxTokens: "128k",
        premium: true,
        image: true,
        notes: "Fast, cost-effective GPT-4 variant with image input support.",
        experimental: false,
        provider: "openai",
        sortOrder: 40,
        supportsStreaming: true,
    },

    {
        name: "GPT-3.5 Turbo",
        apiModelName: "gpt-3.5-turbo",
        maxTokens: "16k",
        premium: false,
        image: false,
        notes: "Best for general tasks with high speed and low cost.",
        experimental: false,
        provider: "openai",
        sortOrder: 50,
        supportsStreaming: true,
    },
    {
        name: "GPT-3.5 Turbo (4K)",
        apiModelName: "gpt-3.5-turbo-0613",
        maxTokens: "4k",
        premium: false,
        image: false,
        notes: "Legacy 3.5 model with 4k context limit.",
        experimental: false,
        provider: "openai",
        sortOrder: 60,
        supportsStreaming: true,
    },
    {
        name: "GPT-4 Turbo (128k)",
        apiModelName: "gpt-4-0125-preview",
        maxTokens: "128k",
        premium: true,
        image: true,
        notes: "Preview release of GPT-4 Turbo with very long context window.",
        experimental: false,
        provider: "openai",
        sortOrder: 70,
        supportsStreaming: true,
    },
    {
        name: "GPT-4 Turbo (Vision)",
        apiModelName: "gpt-4-vision-preview",
        maxTokens: "128k",
        premium: true,
        image: true,
        notes: "Specialized for visual tasks with image input.",
        experimental: false,
        provider: "openai",
        sortOrder: 80,
        supportsStreaming: true,
    },
    {
        name: "DeepSeek V3",
        apiModelName: "deepseek/deepseek-chat-v3-0324:free",
        maxTokens: "128k",
        premium: false,
        image: false,
        notes: "mixture-of-experts model, is the latest iteration of the flagship chat model family from the DeepSeek team",
        experimental: true,
        provider: "openrouter",
        sortOrder: 90,
        supportsStreaming: true,
    },
]