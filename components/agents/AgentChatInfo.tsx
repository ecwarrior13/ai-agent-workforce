"use client";
import { AgentWithModel } from "@/types/agent";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormInput } from "../forms/FormInput";
import { createValidationSchema } from "@/lib/formValidation";
import { submitAgentInputs } from "@/actions/submitAgentInputs";
import { useState } from "react";
import { toast } from "sonner";

interface AgentChatInfoProps {
  agent: AgentWithModel;
  chatSessionId: string;
  onInputsSubmitted?: () => void;
}

type FormValues = Record<string, string | number | boolean | null>;

export default function AgentChatInfo({
  agent,
  chatSessionId,
  onInputsSubmitted,
}: AgentChatInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(createValidationSchema(agent.required_inputs)),
    defaultValues: Object.fromEntries(
      agent.required_inputs.map((input) => [
        input.name,
        input.default_value || "",
      ]),
    ),
  });

  const onSubmitForm = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form data:", data);
      const result = await submitAgentInputs(agent.id, chatSessionId, data);
      console.log("Submit result:", result);

      if (!result.success) {
        toast.error(result.error || "Failed to submit inputs");
        return;
      }

      toast.success("Inputs submitted successfully");
      setHasSubmitted(true);
      console.log("Calling onInputsSubmitted callback");
      onInputsSubmitted?.();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-xl font-semibold">{agent.name}</h2>
        <p className="text-gray-600">{agent.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Model:</span>
          <span className="text-sm font-medium">{agent.model.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">System Prompt:</span>
          <span className="text-sm font-medium">
            {agent.configuration.systemPrompt}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-green-600">
            ✓ Inputs submitted successfully
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-semibold">{agent.name}</h2>
      <p className="text-gray-600">{agent.description}</p>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Model:</span>
        <span className="text-sm font-medium">{agent.model.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">System Prompt:</span>
        <span className="text-sm font-medium">
          {agent.configuration.systemPrompt}
        </span>
      </div>

      {agent.required_inputs.length > 0 && (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmitForm)}
            className="mt-4 space-y-4"
          >
            <h3 className="text-lg font-medium">Required Inputs</h3>
            {agent.required_inputs
              .sort((a, b) => a.order_index - b.order_index)
              .map((input) => (
                <div key={input.id} className="space-y-2">
                  <Label htmlFor={input.name}>
                    {input.label}
                    {input.is_required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </Label>
                  {input.description && (
                    <p className="text-sm text-gray-500">{input.description}</p>
                  )}
                  <FormInput input={input} />
                  {methods.formState.errors[input.name] && (
                    <p className="text-sm text-red-500">
                      {methods.formState.errors[input.name]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
