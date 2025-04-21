"use server";

import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";

// Define the model type
export type LLMModel = {
    id: string;
    name: string;
    provider: string;
    api_model_name: string;
    notes: string | null;
    disabled: boolean;
    premium: boolean;
};

// Define the response type
type GetModelsResult = {
    success: boolean;
    error?: string;
    data?: LLMModel[];
};

// Cache the results for 1
const getModelsCached = unstable_cache(
    async (models: LLMModel[]) => {
        try {
            if (!models || models.length === 0) {
                console.error("No models provided to cache function");
                return {
                    success: false,
                    error: "No models found",
                };
            }

            return {
                success: true,
                data: models,
            };
        } catch (error) {
            console.error("Error in cached function:", error);
            return {
                success: false,
                error: `Cached function error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    },
    ["llm_models"],
    {
        revalidate: 604800, // 1 week
        tags: ["llm_models"],
    }
);

export async function getModels(): Promise<GetModelsResult> {
    try {
        const supabase = await createClient();

        // First check authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error("Auth error:", userError);
            return {
                success: false,
                error: `Authentication error: ${userError.message}`,
            };
        }

        if (!user) {
            console.error("No user found");
            return {
                success: false,
                error: "User not authenticated",
            };
        }

        // Fetch models from database
        const { data: models, error: dbError } = await supabase
            .from("llm_models")
            .select("id, name, provider, notes, api_model_name, disabled, premium")
            .eq("disabled", false)
            .order("name");

        if (dbError) {
            console.error("Database error:", dbError);
            return {
                success: false,
                error: `Database error: ${dbError.message}`,
            };
        }

        if (!models) {
            console.error("No models returned from database");
            return {
                success: false,
                error: "No models found",
            };
        }

        // Pass the fetched models to the cached function
        return await getModelsCached(models);
    } catch (error) {
        console.error("Unexpected error in getModels:", error);
        return {
            success: false,
            error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}