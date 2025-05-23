import { z } from "zod";
import { agentSchema } from "@/schemas/agentSchema";

// LLM Model type (moved from actions/getModels.ts)
export type LLMModel = {
    id: string;
    name: string;
    provider: string;
    api_model_name: string;
    notes: string | null;
    disabled: boolean;
    premium: boolean;
};

// Base type from schema
export type AgentFormData = z.infer<typeof agentSchema>;

// Database Agent type (extends form data with database fields)
export type Agent = AgentFormData & {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
};

// Required Input type
export type RequiredInput = {
    id: string;
    name: string;
    label: string;
    description: string | null;
    type: 'text' | 'number' | 'url' | 'email' | 'date' | 'select' | 'multiselect' | 'file' | 'textarea';
    is_required: boolean;
    is_premium: boolean;
    validation_rules: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        [key: string]: unknown;
    };
    options: Array<{
        label: string;
        value: string | number;
    }>;
    placeholder: string | null;
    default_value: string | null;
    order_index: number;
};

// Agent with model data
export type AgentWithModel = Agent & {
    model: LLMModel;  // Include the full model data
    required_inputs: RequiredInput[];  // Include required inputs
};

// Agent with computed/derived properties for display
export type AgentWithDisplay = AgentWithModel & {
    statusColor: string;
    statusText: string;
};

// Helper function to get status display properties
export function getAgentStatusDisplay(status: Agent['status']): { color: string; text: string } {
    switch (status) {
        case 'active':
            return { color: 'bg-green-100 text-green-800', text: 'Active' };
        case 'inactive':
            return { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
        case 'draft':
            return { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' };
        default:
            return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
    }
}