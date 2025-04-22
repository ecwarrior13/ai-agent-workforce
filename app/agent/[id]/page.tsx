import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function AgentChatPage() {
  const agent = false;
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-2 md:px-4 h-full py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Leftside - Agent Details */}
            <div className="order-2 flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white h-[calc(100vh-150px)] min-h-[500px]">
              <h2 className="text-lg font-semibold text-primary">
                Agent Details
              </h2>
              <div className="flex-1 overflow-y-auto">
                {agent ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {agent.description || "No description provided."}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Model:</div>
                      <div className="font-medium">
                        {agent.modelDetails?.name}
                      </div>

                      <div>Temperature:</div>
                      <div className="font-medium">
                        {agent.configuration?.temperature || "Default"}
                      </div>

                      <div>Max Tokens:</div>
                      <div className="font-medium">
                        {agent.configuration?.maxTokens || "Default"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Rightside - Chat Interface */}
            <div className="order-1 lg:order-2 flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white h-[calc(100vh-150px)] min-h-[500px] overflow-hidden">
              {agent ? (
                <div className="h-full">
                  <ChatInterface agent={agent} chatId={`chat-${agentId}`} />
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentChatPage;
