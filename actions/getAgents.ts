"use server";
import { Agent } from "@/types/agent";
import { createClient } from "@/utils/supabase/server";


type GetAgentsResult = {
    success: boolean;
    error?: string;
    data?: Agent | Agent[];
};

export async function getAgents(): Promise<GetAgentsResult> {
    const supabase = await createClient();

    // First check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Auth error:", userError);
        return {
            success: false,
            error: userError ? `Authentication error: ${userError.message}` : "User not authenticated",
        };
    }

    const { data: agents, error: dbError } = await supabase
        .from("agents")
        .select(`
          *,
          model:llm_models (
            id,
            name,
            provider,
            api_model_name,
            notes,
            disabled,
            premium
          )
        `)
        .eq('created_by', user.id)
        .order("created_at", { ascending: false });

    if (dbError) {
        console.error("Database error:", dbError);
        return {
            success: false,
            error: `Database error: ${dbError.message}`,
        };
    }

    if (!agents) {
        return {
            success: true,
            data: agents || [],
        }
    }
    return {
        success: true,
        data: agents || [],
    }
}

export async function getAgentById(id: string): Promise<GetAgentsResult & { data?: Agent }> {
    const supabase = await createClient();

    // First check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Auth error:", userError);
        return {
            success: false,
            error: userError ? `Authentication error: ${userError.message}` : "User not authenticated",
        };
    }

    const { data: agent, error: dbError } = await supabase
        .from("agents")
        .select(`
            *,
            model:llm_models (
                id,
                name,
                provider,
                api_model_name,
                notes,
                disabled,
                premium
        )
        `)
        .eq('id', id)
        // Allow access if:
        // 1. User is creator
        // OR
        // 2. (agent is public AND system_type is basic)
        .or(`created_by.eq.${user.id},and(is_public.eq.true,system_type.eq.basic)`)
        .single();

    if (dbError) {
        console.error("Database error:", dbError);
        return {
            success: false,
            error: `Database error: ${dbError.message}`,
        };
    }

    if (!agent) {
        return {
            success: false,
            error: "Agent not found",
        };
    }

    return {
        success: true,
        data: agent,
    };
}
