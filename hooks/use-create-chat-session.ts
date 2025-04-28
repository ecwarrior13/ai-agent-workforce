import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { ChatSession } from '@/types/chat';

interface UseCreateChatSessionProps {
    agentId: string;
    agentName: string;
    userId: string | null;
    isLoading: boolean;
}

export function useCreateChatSession({ agentId, agentName, userId, isLoading }: UseCreateChatSessionProps) {
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);
    const [isCreatingSession, setIsCreatingSession] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const createSession = async () => {
            if (isLoading || isCreatingSession || chatSession) return;
            if (!userId) {
                toast.error("You must be logged in to start a chat session");
                return;
            }

            setIsCreatingSession(true);
            try {
                const { data, error } = await supabase
                    .from("chat_sessions")
                    .insert([
                        {
                            agent_id: agentId,
                            user_id: userId,
                            title: `Chat with ${agentName}`,
                            created_at: new Date().toISOString(),
                        },
                    ])
                    .select()
                    .single();

                if (error) {
                    console.error("Session creation error:", error);
                    if (error.code === "42501") {
                        toast.error("Permission denied. Please contact support.");
                    } else {
                        toast.error("Failed to create chat session");
                    }
                    return;
                }
                setChatSession(data);
            } catch (error) {
                console.error("Error creating chat session:", error);
                toast.error("Failed to create chat session");
            } finally {
                setIsCreatingSession(false);
            }
        };

        createSession();
    }, [userId, isLoading, agentId, agentName, isCreatingSession, chatSession, supabase]);

    return { chatSession, setChatSession, isCreatingSession };
} 