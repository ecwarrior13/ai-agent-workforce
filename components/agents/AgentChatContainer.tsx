"use client";

import { useState } from "react";
import { AgentWithModel } from "@/types/agent";
import AgentChatInfo from "./AgentChatInfo";
import AiAgentChat from "../chat/AiAgentChat";

interface AgentChatContainerProps {
  agent: AgentWithModel;
  chatSessionId: string;
}

export default function AgentChatContainer({
  agent,
  chatSessionId,
}: AgentChatContainerProps) {
  const [hasSubmittedInputs, setHasSubmittedInputs] = useState(false);

  const handleInputsSubmitted = () => {
    console.log("AgentChatContainer: Inputs submitted callback received");
    setHasSubmittedInputs(true);
  };

  console.log("AgentChatContainer render:", { hasSubmittedInputs });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left side */}
      <div className="order-2 flex flex-col gap-4 border-gray-200 bg-white p-6 lg:order-1 lg:border-r">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <AgentChatInfo
            agent={agent}
            chatSessionId={chatSessionId}
            onInputsSubmitted={handleInputsSubmitted}
          />
        </div>
      </div>
      {/* Right Side */}
      <div className="order-1 h-[500px] bg-white md:h-[calc(100vh-6rem)] lg:sticky lg:top-20 lg:order-2">
        <AiAgentChat
          agent={agent}
          chatSessionId={chatSessionId}
          hasSubmittedInputs={hasSubmittedInputs}
        />
      </div>
    </div>
  );
}
