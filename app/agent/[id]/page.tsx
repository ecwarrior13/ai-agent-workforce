import { getAgentById } from "@/actions/getAgents";
import AgentChatInfo from "@/components/agents/AgentChatInfo";
import AiAgentChat from "@/components/chat/AiAgentChat";
import { AgentWithModel } from "@/types/agent";
import { redirect } from "next/navigation";
//import { useParams } from "next/navigation";

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

  if (!success || !agent) {
    redirect("/dashboard");
  }

  return (
    <div className="xl:container mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side */}
        <div className="order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6">
          <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white">
            <AgentChatInfo agent={agent} />
          </div>
        </div>
        {/* Right Side */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-20 bg-white h-[500px] md:h-[calc(100vh-6rem)]">
          <AiAgentChat agent={agent} />
        </div>
      </div>
    </div>
  );
}
