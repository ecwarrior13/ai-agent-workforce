"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative my-2 rounded-md bg-black/80 text-white">
      {language && (
        <div className="flex items-center justify-between px-4 py-1.5 text-xs text-gray-300 border-b border-gray-700">
          <span>{language}</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre className={cn("p-4 overflow-x-auto", !language && "pt-2")}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
