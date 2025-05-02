import { z } from "zod";

// Define the input type enum
export const inputTypeEnum = z.enum([
    'text',
    'number',
    'url',
    'email',
    'date',
    'textarea'
]);

// Define the required input schema
export const requiredInputSchema = z.object({
    name: z.string().min(1, "Input name is required"),
    label: z.string().min(1, "Input label is required"),
    description: z.string().optional(),
    type: inputTypeEnum,
    is_required: z.boolean().default(true),
    is_premium: z.boolean().default(false),
    validation_rules: z.record(z.any()).default({}),
    options: z.array(z.any()).default([]), // For select/multiselect types
    placeholder: z.string().optional(),
    default_value: z.string().optional(),
    order_index: z.number().min(0, "Order index must be non-negative")
});

// Define the agent schema
export const agentSchema = z.object({
    // Basic Information
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    model_id: z.string().min(1, "Model ID is required"),

    // Configuration
    configuration: z.object({
        systemPrompt: z.string().min(1, "System prompt is required"),
    }).default({ systemPrompt: "" }),

    // Performance Settings
    max_tokens: z.number().optional(),
    temperature: z.number().min(0).max(1).default(0.7),

    // System Settings
    is_premium: z.boolean().default(false),
    status: z.enum(["draft", "active", "inactive"]).default("draft"),
    version: z.number().default(1),
    is_public: z.boolean().default(false),
});

// Export the inferred types
export type InputType = z.infer<typeof inputTypeEnum>;
export type RequiredInput = z.infer<typeof requiredInputSchema>;
export type AgentFormData = z.infer<typeof agentSchema>; 