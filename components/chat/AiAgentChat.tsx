"use client";

import React, { useEffect, useRef, useState } from "react";
import { Message, useChat } from "@ai-sdk/react";

import {
  BotIcon,
  ImageIcon,
  LetterText,
  PenIcon,
  PlusCircle,
  Send,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initialMessages } from "@/config/testMessages";
import { ChatMessage } from "./ChatMessage";

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

function AiAgentChat({ videoId }: { videoId: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, append, status } = useChat({
    maxSteps: 5,
    body: {
      videoId,
    },
  });

  useEffect(() => {
    if (bottomRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let toastId;

    console.log(status);
    switch (status) {
      case "submitted":
        toastId = toast("Agent is thinking...", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "streaming":
        toastId = toast("Agent is replying...", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "error":
        toastId = toast("Whoops! Something went wrong, please try again.", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });

        break;
      case "ready":
        toast.dismiss(toastId);

        break;
    }
  }, [status]);

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">AI Agent</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs bg-primary text-white ml-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        ref={messagesContainerRef}
      >
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-500">
                  Ask any question about your video!
                </p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      {/* Input form */}
      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={"Ask anything about your video..."}
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white text-sm rounded-full
            hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === "streaming" || status === "submitted"}
            >
              {status === "streaming" ? (
                "AI is replying..."
              ) : status === "submitted" ? (
                "AI is thinking..."
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <div className="flex gap-2">
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <LetterText className="w-4 h-4" />
            </button>
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <PenIcon className="w-4 h-4" />
              Generate Title
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <ImageIcon className="w-4 h-4" />
              Generate Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAgentChat;
