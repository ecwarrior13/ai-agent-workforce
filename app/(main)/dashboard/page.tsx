import { getAgents } from "@/actions/getAgents";

import { Button } from "@/components/ui/button";
import { AgentWithModel } from "@/types/agent";

import { createClient } from "@/utils/supabase/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import AgentsDisplay from "./_components/AgentsDisplay";
import TasksPage from "@/components/tasks/TaskPage";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }
  const { data: agents, error, success } = await getAgents();

  const typedAgents = agents as AgentWithModel[];
  // Handle error state
  if (!success) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Error Loading Agents
          </h1>
          <p className="text-red-500">{error || "Failed to load agents"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Welcome, {user.user_metadata?.full_name || "User"}!
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Leftside */}
        <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4">
          {typedAgents && typedAgents.length === 0 ? (
            <div className="py-12 text-center">
              <h2 className="mb-2 text-xl font-medium">
                You do not have any agents yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first AI agent.
              </p>
              <Link href="/dashboard/create-agent">
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Your First Agent
                </Button>
              </Link>
            </div>
          ) : (
            // Agents Exist View
            <div className="space-y-4">
              {/* Header and button in the same line with space between */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Your Agents</h2>
                <Link href="/dashboard/create-agent">
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create New Agent
                  </Button>
                </Link>
              </div>

              <AgentsDisplay initialAgents={typedAgents} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 lg:order-2">
          Right Side
          <TasksPage />
        </div>
      </div>
    </div>
  );
}
