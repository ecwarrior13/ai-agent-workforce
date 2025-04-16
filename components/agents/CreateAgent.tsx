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

import { aiModelList } from "@/config/aiModels";

function CreateAgent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState(
    "jn7avtfkf0p8c1y997b5dw1p5x7d2ktj"
  );

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New AI Agent</h1>

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
              <Select
                name="modelId"
                defaultValue={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {aiModelList?.map((model) => (
                    <SelectItem
                      key={model.apiModelName}
                      value={model.apiModelName}
                    >
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
              <p className="text-xs text-muted-foreground">
                This is the instruction set that defines your agent&apos;s
                personality and capabilities.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <span className="text-xs text-muted-foreground">
                  {temperature < 0.3
                    ? "More focused"
                    : temperature > 0.7
                      ? "More creative"
                      : "Balanced"}
                </span>
              </div>
              <Slider
                id="temperature"
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
              <p className="text-xs text-muted-foreground">
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
