"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Rocket, MoreVertical, FileEdit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentWithModel } from "@/types/agent";

interface CustomCardProps {
  agent: AgentWithModel;
  onEdit?: () => void;
  onDelete?: () => void;
  onLaunch?: () => void;
}

export default function CustomCard({
  agent,
  onEdit,
  onDelete,
  onLaunch,
}: CustomCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const formattedDate = new Date(agent.created_at).toLocaleDateString();

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src="/robot_chat_red.png"
              alt="Robot Chat Icon"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <h3 className="font-semibold">{agent.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="h-[4.5rem]">
          <div
            className={cn(
              "text-muted-foreground h-full overflow-hidden text-sm",
              isHovering && "overflow-y-auto",
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {agent.description || "No description provided."}
          </div>
        </div>
        <div className="mt-4">
          <Badge variant="outline" className="text-xs">
            {agent.model.name}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <div className="text-muted-foreground flex w-full items-center justify-between text-xs">
          <span>Created: {formattedDate}</span>
          <Badge
            variant={agent.is_public ? "default" : "outline"}
            className="text-xs"
          >
            {agent.is_public ? "Public" : "Private"}
          </Badge>
        </div>
        <Button
          onClick={onLaunch}
          size="sm"
          className="w-full cursor-pointer gap-1"
        >
          <Rocket className="h-4 w-4" />
          Launch
        </Button>
      </CardFooter>
    </Card>
  );
}
