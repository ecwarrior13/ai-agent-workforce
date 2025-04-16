import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user.user_metadata?.full_name || "User"}!
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leftside */}
        <div className="flex flex-col gap-6 p-4 border border-gray-200 rounded-xl bg-white">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">
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
        </div>

        <div className="lg:order-2 flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white">
          Right Side
        </div>
      </div>
    </div>
  );
}
