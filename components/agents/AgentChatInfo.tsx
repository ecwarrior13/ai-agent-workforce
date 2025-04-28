import { AgentWithModel } from "@/types/agent";

interface AgentChatInfoProps {
  agent: AgentWithModel;
}

export default function AgentChatInfo({ agent }: AgentChatInfoProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-semibold">{agent.name}</h2>
      <p className="text-gray-600">{agent.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Model:</span>
        <span className="text-sm font-medium">{agent.model.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">System Prompt:</span>
        <span className="text-sm font-medium">
          {agent.configuration.systemPrompt}
        </span>
      </div>
    </div>
  );
}
