"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentWithModel } from "@/types/agent";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface AgentCardProps {
  agent: AgentWithModel;
  onAction?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AgentCard({
  agent,
  onAction,
  onEdit,
  onDelete,
}: AgentCardProps) {
  const formattedDate = new Date(agent.created_at).toLocaleDateString();
  return (
    <div className="w-full">
      <Card className="overflow-hidden h-full pt-2 pb-4">
        {/* Status header with icon */}
        <CardHeader className="flex flex-row justify-between items-center p-1.5">
          <span className="text-lg font-medium">{agent.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {/* Content with overlapping avatar */}
        <div className="relative flex flex-col items-center -mt-6">
          {/* Avatar circle */}
          <div
            className="bg-[#f1faee] rounded-full p-4 flex items-center justify-center"
            aria-label="Agent icon"
          >
            <Image
              src="/robot_chat_red.png"
              alt="Agent icon"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="sr-only">Agent icon</span>
          </div>

          <CardContent className="flex-grow w-full">
            <div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-center">Description</span>
                <div className="relative min-h-[4.5rem] group">
                  <p className="text-sm line-clamp-3 group-hover:line-clamp-none group-hover:absolute group-hover:bg-white group-hover:shadow-md group-hover:p-2 group-hover:rounded group-hover:z-10 group-hover:max-h-48 group-hover:overflow-y-auto transition-all duration-200">
                    {agent.description || "No description provided."}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Public:</span>
                <span
                  className={
                    agent.is_public ? "text-green-500" : "text-red-500"
                  }
                >
                  {agent.is_public ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </CardContent>

          <CardContent className="pt-2 text-center px-4">
            <Button
              variant="outline"
              className="bg-primary text-white rounded-full px-4 py-1 text-sm"
              onClick={onAction}
            >
              Launch
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
