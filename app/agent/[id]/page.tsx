import { getAgentById } from "@/actions/getAgents";
import { AgentWithModel } from "@/types/agent";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AgentChatContainer from "@/components/agents/AgentChatContainer";

interface AgentPageProps {
  params: {
    id: string;
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const resolvedParams = await params;
  const agentId = resolvedParams.id;

  const {
    data: agent,
    error,
    success,
  } = (await getAgentById(agentId)) as {
    data: AgentWithModel | undefined;
    error?: string;
    success: boolean;
  };

  if (!success || !agent || error) {
    redirect("/dashboard");
  }

  // Create a chat session if the agent has required inputs
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Create chat session
  const { data: chatSession, error: chatError } = await supabase
    .from("chat_sessions")
    .insert([
      {
        agent_id: agentId,
        user_id: user.id,
        title: `Chat with ${agent.name}`,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (chatError) {
    console.error("Error creating chat session:", chatError);
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto px-4 md:px-0 xl:container">
      <AgentChatContainer agent={agent} chatSessionId={chatSession.id} />
    </div>
  );
}
