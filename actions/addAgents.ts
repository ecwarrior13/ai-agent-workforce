"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { agentSchema, type AgentFormData } from "@/schemas/agentSchema";
import { z } from "zod";

// Define the response type
type ActionResult = {
    success: boolean;
    error?: string;
    data?: AgentFormData;
};

export async function addAgent(formData: FormData): Promise<ActionResult> {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                success: false,
                error: "User not authenticated",
            };
        }

        // Parse and validate form data
        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            model_id: formData.get("modelId"),
            configuration: {
                systemPrompt: formData.get("systemPrompt"),
            },
            max_tokens: formData.get("maxTokens") ? Number(formData.get("maxTokens")) : undefined,
            temperature: Number(formData.get("temperature") || 0.7),
            is_premium: false, // Default value
            status: "draft", // Default value
            version: 1, // Default value
            is_public: formData.get("is_public") === "on", // Convert "on" to boolean
        };

        console.log("Raw data:", rawData);

        // Validate the data
        const validatedData = agentSchema.parse(rawData);

        console.log("Validated data:", validatedData);
        // Insert into database
        const { data: agent, error: insertError } = await supabase
            .from("agents")
            .insert({
                ...validatedData,
                created_by: user.id,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting agent:", insertError);
            return {
                success: false,
                error: "Failed to create agent. Please try again.",
            };
        }

        // Revalidate the agents page
        revalidatePath("/dashboard");

        return {
            success: true,
            data: validatedData,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
            return {
                success: false,
                error: error.errors[0].message,
            };
        }

        console.error("Unexpected error:", error);
        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
}
