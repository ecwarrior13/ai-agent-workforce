import React from "react";
import { ChatMessages } from "./ChatMessages";
import { Button } from "../ui/button";

function ChatInterface() {
  return (
    <div className="flex flex-col h-full relative">
      <ChatSelector agentName={agent.name} />
      {/* Messages component */}
      <ChatMessages messages={messages} isLoading={isLoading} />

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
