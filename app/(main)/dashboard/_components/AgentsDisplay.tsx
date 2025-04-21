"use client";
//import AgentCard from "@/components/agents/agent-card";
import { Button } from "@/components/ui/button";
import { AgentWithModel } from "@/types/agent";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import EditAgentDialog from "./EditAgentDialog";
import CustomCard from "@/components/agents/custom-agent";

interface AgentsDisplayProps {
  initialAgents: AgentWithModel[];
}

function AgentsDisplay({ initialAgents }: AgentsDisplayProps) {
  const [agents] = useState(initialAgents);
  const [visibleAgents, setVisibleAgents] = useState(agents.slice(0, 4));
  const [hasMore, setHasMore] = useState(agents.length > 4);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<AgentWithModel | null>(null);

  const loadMore = () => {
    const currentLength = visibleAgents.length;
    const newVisibleAgents = agents.slice(0, currentLength + 4);
    setVisibleAgents(newVisibleAgents);
    setHasMore(newVisibleAgents.length < agents.length);
  };

  const handleEdit = (agent: AgentWithModel) => {
    setAgentToEdit(agent);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleAgents.map((agent) => (
          //   <AgentCard
          //     key={agent.id}
          //     agent={agent}
          //     onEdit={() => handleEdit(agent)}
          //   />
          <CustomCard
            key={agent.id}
            agent={agent}
            onEdit={() => handleEdit(agent)}
          />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            className="bg-primary text-white flex items-center gap-2"
          >
            Load More <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
      {agentToEdit && (
        <EditAgentDialog
          open={isEditDialogOpen}
          setOpen={setIsEditDialogOpen}
          agent={agentToEdit}
        />
      )}
    </div>
  );
}

export default AgentsDisplay;
