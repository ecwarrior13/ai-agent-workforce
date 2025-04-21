"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentWithModel } from "@/types/agent";
import { useEffect, useState } from "react";
import { type LLMModel } from "@/actions/getModels";
import { getModels } from "@/actions/getModels";
import { Switch } from "../ui/switch";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface EditAgentFormProps {
  agentEdit: AgentWithModel;
  onClose: () => void;
}

export default function EditAgentForm({
  agentEdit,
  onClose,
}: EditAgentFormProps) {
  console.log("@agentEdit.temperature", agentEdit.temperature);
  const [temperature, setTemperature] = useState(agentEdit.temperature);
  const [selectedModel, setSelectedModel] = useState(agentEdit.model_id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiModelList, setAiModelList] = useState<LLMModel[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const models = await getModels();
      if (models.success) {
        setAiModelList(models.data || []);
      }
    };
    fetchModels();
  }, []);

  console.log("@temperature", temperature);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      const supabase = await createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("User not authenticated");
        return;
      }

      const updateAgent = {
        name: formData.get("name"),
        description: formData.get("description"),
        model_id: selectedModel,
        is_public: formData.get("is_public") === "on",
        configuration: {
          systemPrompt: formData.get("systemPrompt"),
        },
        temperature: temperature,
        max_tokens: formData.get("maxTokens")
          ? parseInt(formData.get("maxTokens") as string)
          : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("agents")
        .update({
          ...updateAgent,
          version: (agentEdit.version || 0) + 1,
        })
        .eq("id", agentEdit.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success("Agent updated successfully");

      onClose();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-4 max-w-2xl max-h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Edit AI Agent</h1>
      <form action={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Agent Details</CardTitle>
            <CardDescription>
              Update your AI agent&apos;s personality and capabilities
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
                defaultValue={agentEdit.name || ""}
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
                defaultValue={agentEdit.description || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelId">AI Model</Label>
              <Select
                name="modelId"
                value={selectedModel}
                onValueChange={(value) => setSelectedModel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {aiModelList.map((model) => (
                    <SelectItem key={model.api_model_name} value={model.id}>
                      {model.name}
                      {model.premium && (
                        <span className="ml-2 text-xs text-amber-500">
                          Premium
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Switch
                id="is_public"
                name="is_public"
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                defaultChecked={agentEdit.is_public}
              />
              <Label htmlFor="is_public">Make public</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                className="bg-white"
                id="systemPrompt"
                name="systemPrompt"
                placeholder="Instructions for how the AI should behave..."
                rows={5}
                defaultValue={agentEdit.configuration?.systemPrompt || ""}
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
                name="temperature"
                min={0}
                max={1}
                step={0.1}
                defaultValue={[agentEdit.temperature || 0.7]}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                aria-label="Temperature"
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
                defaultValue={agentEdit.max_tokens}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens in the response. Leave empty for model
                default.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
