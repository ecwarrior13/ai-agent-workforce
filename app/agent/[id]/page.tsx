"use client";

import AiAgentChat from "@/components/chat/AiAgentChat";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function AgentPage() {
  const params = useParams<{ videoId: string }>();
  const { videoId } = params;

  return (
    <div className="xl:container mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* // Left side */}
        <div className="order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6">
          <p>Left Side</p>

          <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white"></div>
        </div>
        {/* // right Side */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-20 bg-white h-[500px] md:h-[calc(100vh-6rem)]">
          {/* AI agent Chat section */}
          <AiAgentChat videoId={videoId} />
        </div>
      </div>
    </div>
  );
}

export default AgentPage;
