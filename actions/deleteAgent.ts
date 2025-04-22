"use server";

import { createClient } from "@/utils/supabase/server";

type DeleteAgentResult = {
    success: boolean;
    error?: string;
    agentId?: string;
};

export async function deleteAgent(agentId: string): Promise<DeleteAgentResult> {
    try {
        const supabase = await createClient();
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                success: false,
                error: "User not authenticated. Please log in again.",
            };
        }

        const { error: agentError } = await supabase
            .from("agents")
            .delete()
            .eq("id", agentId)
            .eq("created_by", user.id);

        if (agentError) {
            console.error("Supabase delete error:", agentError);
            return {
                success: false,
                error: agentError.message || "Failed to delete agent. Please try again.",
            };
        }

        return {
            success: true,
            agentId: agentId
        };

    } catch (error) {
        console.error("Error deleting agent:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred while deleting the agent",
        };
    }
}

