"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { type LLMModel } from "@/actions/getModels";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { addAgent } from "@/actions/addAgents";
import { RequiredInputs } from "./required-inputs";

interface CreateAgentProps {
  models: LLMModel[];
}

function CreateAgent({ models }: CreateAgentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temperature, setTemperature] = useState(0.3);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    models.length > 0 ? models[0].id : "",
  );

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      const result = await addAgent(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Agent created successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New AI Agent</h1>

      <form action={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Agent Details</CardTitle>
            <CardDescription>
              Configure your AI agent&apos;s personality and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                className="bg-white"
                id="name"
                name="name"
                placeholder="e.g., Research Assistant"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                className="bg-white"
                id="description"
                name="description"
                placeholder="What does this agent do?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelId">AI Model</Label>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Select
                    name="modelId"
                    defaultValue={selectedModel}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models?.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                          {model.premium && (
                            <span className="ml-2 text-xs text-amber-500">
                              Premium
                            </span>
                          )}
                        </SelectItem>
                      )) || []}
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    name="is_public"
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                  />
                  <Label htmlFor="is_public">Make public</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_premium"
                    name="is_premium"
                    checked={isPremium}
                    onCheckedChange={setIsPremium}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                  />
                  <Label htmlFor="is_premium" className="text-lg font-semibold">
                    Enhanced Premium Agent
                  </Label>
                </div>
                {isPremium && (
                  <span className="text-xs text-amber-500">
                    Premium features enabled
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                Enable premium features including custom tools, required inputs,
                and enhanced system prompts.
              </p>
            </div>
            {isPremium && (
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Required Inputs</Label>
                <p className="text-muted-foreground text-sm">
                  Define the inputs that users must provide when interacting
                  with this agent.
                </p>
                <RequiredInputs onInputsChange={() => {}} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                className="bg-white"
                id="systemPrompt"
                name="systemPrompt"
                placeholder="Instructions for how the AI should behave..."
                rows={5}
                required
              />
              <p className="text-muted-foreground text-xs">
                This is the instruction set that defines your agent&apos;s
                personality and capabilities.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <span className="text-muted-foreground text-xs">
                  {temperature < 0.3
                    ? "More focused"
                    : temperature > 0.7
                      ? "More creative"
                      : "Balanced"}
                </span>
              </div>
              <Slider
                id="temperature"
                name="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens (Optional)</Label>
              <Input
                className="bg-white"
                id="maxTokens"
                name="maxTokens"
                type="number"
                placeholder="e.g., 2048"
              />
              <p className="text-muted-foreground text-xs">
                Maximum number of tokens in the response. Leave empty for model
                default.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Agent"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default CreateAgent;
