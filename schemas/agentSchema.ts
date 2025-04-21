import { z } from "zod";

export const agentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    model_id: z.string().min(1, "Model ID is required"),
    configuration: z.object({
        systemPrompt: z.string().min(1, "System prompt is required"),
    }).default({ systemPrompt: "" }),
    max_tokens: z.number().optional(),
    temperature: z.number().min(0).max(1).default(0.7),
    is_premium: z.boolean().default(false),
    status: z.enum(["draft", "active", "inactive"]).default("draft"),
    version: z.number().default(1),
    is_public: z.boolean().default(false),
});

// Export the inferred type
export type AgentFormData = z.infer<typeof agentSchema>; 