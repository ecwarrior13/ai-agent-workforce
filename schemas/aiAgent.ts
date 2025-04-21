import { z } from "zod";

export const aiAgentFormSchema = z.object({
    // Agent Identity
    agentName: z.string().min(2, {
        message: "Agent name must be at least 2 characters.",
    }),
    agentRole: z.string().min(2, {
        message: "Agent role must be at least 2 characters.",
    }),
    agentTone: z.string().min(2, {
        message: "Agent tone must be at least 2 characters.",
    }),
    modelId: z.string().min(1, {
        message: "Please select an AI model.",
    }),
    isPublic: z.boolean(),
    avatarStyle: z.string().default("default"),

    // Personality
    personalityTraits: z.string(),
    values: z.string(),

    // Task & Purpose
    objective: z.string().min(10, {
        message: "Objective must be at least 10 characters.",
    }),
    details: z.string().min(10, {
        message: "Details must be at least 10 characters.",
    }),

    // Context & Background
    domainKnowledge: z.string().min(10, {
        message: "Domain knowledge must be at least 10 characters.",
    }),
    knowledgeCutoff: z.string().default("latest"),
    externalResources: z.string(),

    // Response Format
    preferredStyle: z.string().min(2, {
        message: "Preferred style must be at least 2 characters.",
    }),
    responseLength: z.string().min(2, {
        message: "Response length must be at least 2 characters.",
    }),
    formalityLevel: z.enum(["casual", "neutral", "formal"]).default("neutral"),

    // Special Instructions
    restrictions: z.string().min(10, {
        message: "Restrictions must be at least 10 characters.",
    }),
    mandatory: z.string().min(10, {
        message: "Mandatory instructions must be at least 10 characters.",
    }),

    // Interaction Style
    proactivityLevel: z.string().min(2, {
        message: "Proactivity level must be at least 2 characters.",
    }),
    userSkillLevel: z.enum(["beginner", "intermediate", "expert"]).default("intermediate"),
    explanationDepth: z.enum(["brief", "balanced", "detailed"]).default("balanced"),

    // Performance Settings
    temperature: z.number().min(0).max(1).default(0.7),
    creativityLevel: z.enum(["conservative", "balanced", "creative"]).default("balanced"),

    // Error Handling
    ambiguityHandling: z.string().min(10, {
        message: "Ambiguity handling must be at least 10 characters.",
    }),
    feedbackHandling: z.string().min(10, {
        message: "Feedback handling must be at least 10 characters.",
    }),
});

export type AiAgentFormValues = z.infer<typeof aiAgentFormSchema>;

export const avatarOptions = [
    { id: "default", name: "Default", src: "/placeholder.svg?height=40&width=40" },
    { id: "robot", name: "Robot", src: "/placeholder.svg?height=40&width=40&text=🤖" },
    { id: "assistant", name: "Assistant", src: "/placeholder.svg?height=40&width=40&text=👨‍💼" },
    { id: "custom", name: "Custom", src: "/placeholder.svg?height=40&width=40&text=✨" },
]