"use client";

import { deleteAgent } from "@/actions/deleteAgent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AgentWithModel } from "@/types/agent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAgentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agent: AgentWithModel;
}

export default function DeleteAgentDialog({
  open,
  setOpen,
  agent,
}: DeleteAgentDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset states when dialog is closed
      setConfirmText("");
      setIsDeleting(false);
    }
    setOpen(open);
  };

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deleteAgent(agent.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Agent "${agent.name}" deleted successfully`);
        setOpen(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      // Check if it's an Error object and has a message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the agent";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {agent.name}? This action cannot be
            undone.
            <br />
            Please enter <b>{agent.name}</b> to confirm.
            <br />
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type the agent name to confirm"
              disabled={isDeleting}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== agent.name || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
