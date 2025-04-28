"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { createClient } from "@/utils/supabase/client";
import {
  ImageIcon,
  LetterText,
  PenIcon,
  PlusCircle,
  Send,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useCreateChatSession } from "@/hooks/use-create-chat-session";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ChatMessage } from "./ChatMessage";
import { AgentWithModel } from "@/types/agent";

interface AiAgentChatProps {
  agent: AgentWithModel;
}

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface ToolPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}

const formatToolInvocation = (part: ToolPart) => {
  if (!part.toolInvocation) return "Unknown Tool";
  return `🔧 Tool Used: ${part.toolInvocation.toolName}`;
};

function AiAgentChat({ agent }: AiAgentChatProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { user, loading } = useAuth();

  // Development flag to control message saving
  const ENABLE_MESSAGE_SAVING = false;

  const { chatSession, setChatSession } = useCreateChatSession({
    agentId: agent.id,
    agentName: agent.name,
    userId: user?.id || null,
    isLoading: loading,
  });

  const [isStartingNewChat, setIsStartingNewChat] = useState(false);

  const saveMessage = async (content: string, role: "user" | "assistant") => {
    if (!chatSession || !ENABLE_MESSAGE_SAVING) return;

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          session_id: chatSession.id,
          content,
          role,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Failed to save message");
    }
  };

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    status,
    setMessages,
  } = useChat({
    body: {
      modelId: agent.model.api_model_name,
      systemPrompt: agent.configuration.systemPrompt,
      provider: agent.model.provider,
    },
    onFinish: (message) => {
      if (message.role === "assistant") {
        saveMessage(message.content, "assistant");
      }
    },
  });

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Save user message
    await saveMessage(input, "user");

    // Submit to chat
    handleSubmit(e);
  };

  const updateTitle = async (newTitle: string) => {
    if (!chatSession || !user) return;

    try {
      const { error } = await supabase
        .from("chat_sessions")
        .update({ title: newTitle })
        .eq("id", chatSession.id);

      if (error) throw error;

      setChatSession((prev) => (prev ? { ...prev, title: newTitle } : null));
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Failed to update title");
    }
  };

  const handleNewChat = async () => {
    if (!user) {
      toast.error("You must be logged in to start a new chat");
      return;
    }

    setIsStartingNewChat(true);
    try {
      // Reset chat session to trigger new session creation
      setChatSession(null);

      // Clear messages using setMessages
      setMessages([]);

      // Reset input
      handleInputChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);

      toast.success("New chat session started");
    } catch (error) {
      console.error("Error starting new chat:", error);
      toast.error("Failed to start new chat session");
    } finally {
      setIsStartingNewChat(false);
      setShowNewChatDialog(false);
    }
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (bottomRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (status === "error") {
      toast.error("Whoops! Something went wrong, please try again.");
    }
  }, [status]);

  return (
    <div className="flex h-full flex-col" key={chatSession?.id}>
      <div className="hidden border-b border-gray-100 px-4 pb-3 lg:block">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{agent.name}</h2>
          <div className="flex items-center gap-2">
            {chatSession && (
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onBlur={() => updateTitle(titleInput)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateTitle(titleInput);
                      } else if (e.key === "Escape") {
                        setIsEditingTitle(false);
                        setTitleInput(chatSession.title);
                      }
                    }}
                    className="rounded border border-gray-200 px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
                  />
                ) : (
                  <div
                    className="flex cursor-pointer items-center gap-1 rounded border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setTitleInput(chatSession.title);
                      setIsEditingTitle(true);
                    }}
                  >
                    <span>{chatSession.title}</span>
                    <Pencil className="h-3 w-3 text-gray-500" />
                  </div>
                )}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-primary flex items-center gap-1 text-xs text-white"
              onClick={() => setShowNewChatDialog(true)}
              disabled={isStartingNewChat}
            >
              {isStartingNewChat ? (
                <>
                  <PlusCircle className="h-3.5 w-3.5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <PlusCircle className="h-3.5 w-3.5" />
                  New Chat
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new chat?</DialogTitle>
            <DialogDescription>
              This will clear the current conversation and start a new chat
              session with {agent.name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewChatDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleNewChat} disabled={isStartingNewChat}>
              {isStartingNewChat ? "Starting..." : "Start New Chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        ref={messagesContainerRef}
      >
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-medium text-gray-700">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-500">
                  Ask any question about your agent!
                </p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role as "system" | "user" | "assistant"}
              content={message.content}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      {/* Input form */}
      <div className="border-t border-gray-100 bg-white p-4">
        <div className="space-y-3">
          <form onSubmit={handleMessageSubmit} className="flex gap-2">
            <input
              className="focus:ring-primary flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={"Ask your agent anything..."}
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 rounded-full px-4 py-2 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status === "streaming" || status === "submitted"}
            >
              {status === "streaming" ? (
                "AI is replying..."
              ) : status === "submitted" ? (
                "AI is thinking..."
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="flex gap-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 xl:text-sm"
              type="button"
            >
              <LetterText className="h-4 w-4" />
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 xl:text-sm"
              type="button"
            >
              <PenIcon className="h-4 w-4" />
              Generate Title
            </button>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 xl:text-sm"
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
              Generate Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAgentChat;
