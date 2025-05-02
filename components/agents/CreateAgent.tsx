"use client";

import React, { useState, useEffect } from "react";
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
import { RequiredInputs, type RequiredInput } from "./required-inputs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateAgentProps {
  models: LLMModel[];
}

interface FormState {
  name: string;
  description: string;
  modelId: string;
  isPublic: boolean;
  isPremium: boolean;
  systemPrompt: string;
  temperature: number;
  maxTokens: string;
  requiredInputs: RequiredInput[];
}

function CreateAgent({ models }: CreateAgentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form state with default values
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    modelId: models.length > 0 ? models[0].id : "",
    isPublic: false,
    isPremium: false,
    systemPrompt: "",
    temperature: 0.3,
    maxTokens: "",
    requiredInputs: [],
  });

  // Update form state handler
  const updateFormState = (field: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    setFormError(null);

    if (!formState.name.trim()) {
      setFormError("Agent name is required");
      return false;
    }

    if (!formState.systemPrompt.trim()) {
      setFormError("System prompt is required");
      return false;
    }

    if (!formState.modelId) {
      setFormError("Please select an AI model");
      return false;
    }

    if (formState.isPremium && formState.requiredInputs.length > 0) {
      // Check required inputs have necessary fields
      const invalidInputs = formState.requiredInputs.filter(
        (input) => !input.name.trim() || !input.label.trim(),
      );

      if (invalidInputs.length > 0) {
        setFormError("All required inputs must have a name and label");
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  async function handleSubmit(formData: FormData) {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Add form state to FormData
      formData.set("name", formState.name);
      formData.set("description", formState.description);
      formData.set("modelId", formState.modelId);
      formData.set("is_public", formState.isPublic.toString());
      formData.set("is_premium", formState.isPremium.toString());
      formData.set("systemPrompt", formState.systemPrompt);
      formData.set("temperature", formState.temperature.toString());
      if (formState.maxTokens) {
        formData.set("maxTokens", formState.maxTokens);
      }

      // Add required inputs to form data
      formState.requiredInputs.forEach((input, index) => {
        formData.append(`required_inputs[${index}][name]`, input.name);
        formData.append(`required_inputs[${index}][label]`, input.label);
        if (input.description) {
          formData.append(
            `required_inputs[${index}][description]`,
            input.description,
          );
        }
        formData.append(`required_inputs[${index}][type]`, input.type);
        formData.append(
          `required_inputs[${index}][is_required]`,
          input.isRequired.toString(),
        );
        formData.append(
          `required_inputs[${index}][is_premium]`,
          formState.isPremium.toString(),
        );
        if (input.validationRules.length > 0) {
          formData.append(
            `required_inputs[${index}][validation_rules]`,
            JSON.stringify(input.validationRules),
          );
        }
        if (input.placeholder) {
          formData.append(
            `required_inputs[${index}][placeholder]`,
            input.placeholder,
          );
        }
        if (input.defaultValue) {
          formData.append(
            `required_inputs[${index}][default_value]`,
            input.defaultValue,
          );
        }
      });

      const result = await addAgent(formData);
      if (result.error) {
        toast.error(result.error);
        setFormError(result.error);
      } else {
        toast.success("Agent created successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Form sections components for better organization
  const AgentDetailsSection = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input
          className="bg-white"
          id="name"
          name="name"
          value={formState.name}
          onChange={(e) => updateFormState("name", e.target.value)}
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
          value={formState.description}
          onChange={(e) => updateFormState("description", e.target.value)}
          placeholder="What does this agent do?"
          rows={2}
        />
      </div>
    </>
  );

  const ModelSelectionSection = () => (
    <div className="space-y-2">
      <Label htmlFor="modelId">AI Model</Label>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Select
            name="modelId"
            value={formState.modelId}
            onValueChange={(value) => updateFormState("modelId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                  {model.premium && (
                    <span className="ml-2 text-xs text-amber-500">Premium</span>
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
            checked={formState.isPublic}
            onCheckedChange={(checked) => updateFormState("isPublic", checked)}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
          />
          <Label htmlFor="is_public">Make public</Label>
        </div>
      </div>
    </div>
  );

  const PremiumFeaturesSection = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_premium"
            name="is_premium"
            checked={formState.isPremium}
            onCheckedChange={(checked) => updateFormState("isPremium", checked)}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
          />
          <Label htmlFor="is_premium" className="text-lg font-semibold">
            Enhanced Premium Agent
          </Label>
        </div>
        {formState.isPremium && (
          <span className="text-xs text-amber-500">
            Premium features enabled
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm">
        Enable premium features including custom tools, required inputs, and
        enhanced system prompts.
      </p>
    </div>
  );

  const RequiredInputsSection = () =>
    formState.isPremium && (
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Required Inputs</Label>
        <p className="text-muted-foreground text-sm">
          Define the inputs that users must provide when interacting with this
          agent.
        </p>
        <RequiredInputs
          onInputsChange={(inputs) => updateFormState("requiredInputs", inputs)}
          initialInputs={formState.requiredInputs}
        />
      </div>
    );

  const SystemPromptSection = () => (
    <div className="space-y-2">
      <Label htmlFor="systemPrompt">System Prompt</Label>
      <Textarea
        className="bg-white"
        id="systemPrompt"
        name="systemPrompt"
        value={formState.systemPrompt}
        onChange={(e) => updateFormState("systemPrompt", e.target.value)}
        placeholder="Instructions for how the AI should behave..."
        rows={5}
        required
      />
      <p className="text-muted-foreground text-xs">
        This is the instruction set that defines your agent&apos;s personality
        and capabilities.
      </p>
    </div>
  );

  const TemperatureSection = () => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="temperature">
          Temperature: {formState.temperature}
        </Label>
        <span className="text-muted-foreground text-xs">
          {formState.temperature < 0.3
            ? "More focused"
            : formState.temperature > 0.7
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
        value={[formState.temperature]}
        onValueChange={(value) => updateFormState("temperature", value[0])}
      />
    </div>
  );

  const MaxTokensSection = () => (
    <div className="space-y-2">
      <Label htmlFor="maxTokens">Max Tokens (Optional)</Label>
      <Input
        className="bg-white"
        id="maxTokens"
        name="maxTokens"
        type="number"
        value={formState.maxTokens}
        onChange={(e) => updateFormState("maxTokens", e.target.value)}
        placeholder="e.g., 2048"
      />
      <p className="text-muted-foreground text-xs">
        Maximum number of tokens in the response. Leave empty for model default.
      </p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New AI Agent</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
      >
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Agent Details</CardTitle>
            <CardDescription>
              Configure your AI agent&apos;s personality and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AgentDetailsSection />
            <ModelSelectionSection />
            <PremiumFeaturesSection />
            <RequiredInputsSection />
            <SystemPromptSection />
            <TemperatureSection />
            <MaxTokensSection />
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
