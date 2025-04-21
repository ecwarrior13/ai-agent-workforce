"use client";

import EditAgentForm from "@/components/agents/EditAgentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentWithModel } from "@/types/agent";

interface EditAgentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agent: AgentWithModel;
}

export default function EditAgentDialog({
  open,
  setOpen,
  agent,
}: EditAgentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
        </DialogHeader>
        <EditAgentForm agentEdit={agent} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
