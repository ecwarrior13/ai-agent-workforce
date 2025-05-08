"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type InputValue = string | number | boolean | null;

type SubmitAgentInputsResult = {
    success: boolean;
    error?: string;
    data?: {
        chatSessionId: string;
        inputs: Record<string, InputValue>;
    };
};

export async function submitAgentInputs(
    agentId: string,
    chatSessionId: string,
    inputData: Record<string, InputValue>
): Promise<SubmitAgentInputsResult> {
    try {
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                success: false,
                error: "User not authenticated",
            };
        }

        // Get the agent and its required inputs
        const { data: agent, error: agentError } = await supabase
            .from("agents")
            .select(`
                id,
                required_inputs (
                    id,
                    name,
                    type,
                    is_required,
                    validation_rules
                )
            `)
            .eq("id", agentId)
            .single();

        if (agentError || !agent) {
            return {
                success: false,
                error: "Agent not found",
            };
        }

        // Validate all required inputs are present
        const missingInputs = agent.required_inputs
            .filter(input => input.is_required && !inputData[input.name])
            .map(input => input.name);

        if (missingInputs.length > 0) {
            return {
                success: false,
                error: `Missing required inputs: ${missingInputs.join(", ")}`,
            };
        }

        // Insert each input into the agent_inputs table
        const inputPromises = agent.required_inputs.map(async (input) => {
            const value = inputData[input.name];
            if (!value) return null; // Skip if no value provided

            return supabase
                .from("agent_inputs")
                .insert({
                    agent_id: agentId,
                    required_input_id: input.id,
                    user_id: user.id,
                    chat_session_id: chatSessionId,
                    input_data: value,
                    is_valid: true,
                    validation_errors: [],
                    last_validated_at: new Date().toISOString(),
                })
                .select()
                .single();
        });

        const results = await Promise.all(inputPromises);

        // Check for any errors in the results
        const errors = results
            .filter(result => result && result.error)
            .map(result => result?.error?.message);

        if (errors.length > 0) {
            return {
                success: false,
                error: `Failed to save some inputs: ${errors.join(", ")}`,
            };
        }

        return {
            success: true,
            data: {
                chatSessionId,
                inputs: inputData,
            },
        };
    } catch (error) {
        console.error("Error submitting agent inputs:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
} 