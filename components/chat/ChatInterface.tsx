"use client";
import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";

import { Button } from "../ui/button";
import { ChatMessage } from "./ChatMessage";
import { PlusCircle } from "lucide-react";
import { initialMessages } from "@/config/testMessages";

// Initial messages to demonstrate different message types

function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const { input, handleInputChange, handleSubmit, isLoading } = useChat();
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-3 pt-2 border-b rounded-lg border-white bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-primary hidden sm:block">
            AI Agent
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs bg-primary text-white ml-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New Chat
        </Button>
      </div>

      {/* <ChatSelector agentName={agent.name} /> */}
      {/* Messages component */}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white p-4 bg-secondary/20 absolute bottom-0 left-0 right-0">
        <div className="space-y-3">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask your question here"
              className="flex-1 px-4 py-2 text-sm border border-primary rounded-full
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#457b9d] to-[#1d3557] text-white 
              text-sm rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
