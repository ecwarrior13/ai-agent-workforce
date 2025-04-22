"use client";
import { useEffect, useRef } from "react";
import type { Message } from "ai";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./codeBlock";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({
  messages,
  isLoading = false,
}: ChatMessagesProps) {
  // Reference to the message container for scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to format message content with code blocks
  const formatMessageContent = (content: string) => {
    if (!content) return null;

    // Split by code blocks (\`\`\`code\`\`\`)
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract language and code
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);

        if (match) {
          const [, language, code] = match;
          return (
            <CodeBlock
              key={index}
              language={language || "text"}
              code={code.trim()}
            />
          );
        }

        // Fallback if regex doesn't match
        const code = part.slice(3, -3).trim();
        return <CodeBlock key={index} language="text" code={code} />;
      }

      // Regular text - preserve line breaks
      return (
        <div key={index} className="whitespace-pre-wrap">
          {part}
        </div>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 h-full max-h-[calc(100%-80px)]"
    >
      <div className="space-y-6 pb-2">
        {messages.length === 0 && (
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-primary">No chats yet</h3>
            <p className="text-sm text-primary/50">
              Start a new chat by clicking the New Chat button
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-secondary"
                  : "bg-accent text-white"
              )}
            >
              {formatMessageContent(message.content as string)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-accent text-white rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
