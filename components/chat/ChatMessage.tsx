"use client";

import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  className?: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, className }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {/* Message Content */}
      <div
        className={cn(
          "flex-1 space-y-2",
          isUser ? "max-w-[80%]" : "max-w-[85%]"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground ml-auto"
              : "bg-muted border border-border",
            "prose prose-slate max-w-none"
          )}
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";

                return !inline && match ? (
                  <div className="relative my-2">
                    <SyntaxHighlighter
                      language={language}
                      style={vscDarkPlus}
                      PreTag="div"
                      className={cn(
                        "rounded-md !bg-slate-950 !p-4",
                        isUser
                          ? "border-primary-foreground/20"
                          : "border-border"
                      )}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className={cn(
                      "rounded-sm px-1 py-0.5 font-mono text-sm",
                      isUser
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-slate-100 text-slate-900",
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return (
                  <p
                    className={cn(
                      "m-0 leading-normal",
                      isUser ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {children}
                  </p>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
