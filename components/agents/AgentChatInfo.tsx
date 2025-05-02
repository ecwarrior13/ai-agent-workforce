"use client";
import { AgentWithModel, RequiredInput } from "@/types/agent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AgentChatInfoProps {
  agent: AgentWithModel;
  onSubmit?: (data: FormData) => void;
}

// Create a dynamic schema based on required inputs
const createValidationSchema = (inputs: RequiredInput[]) => {
  const schemaFields: Record<string, z.ZodType> = {};

  inputs.forEach((input) => {
    let fieldSchema: z.ZodString | z.ZodNumber;

    switch (input.type) {
      case "text":
      case "textarea":
        fieldSchema = z.string();
        break;
      case "number":
        fieldSchema = z.number();
        break;
      case "url":
        fieldSchema = z.string().url();
        break;
      case "email":
        fieldSchema = z.string().email();
        break;
      case "date":
        fieldSchema = z.string().datetime();
        break;
      case "select":
      case "multiselect":
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.string();
    }

    // Add validation rules
    if (input.validation_rules) {
      if (input.validation_rules.required) {
        if (fieldSchema instanceof z.ZodString) {
          fieldSchema = fieldSchema.min(1, "This field is required");
        }
      }
      if (
        input.validation_rules.minLength &&
        fieldSchema instanceof z.ZodString
      ) {
        fieldSchema = fieldSchema.min(input.validation_rules.minLength);
      }
      if (
        input.validation_rules.maxLength &&
        fieldSchema instanceof z.ZodString
      ) {
        fieldSchema = fieldSchema.max(input.validation_rules.maxLength);
      }
      if (
        input.validation_rules.pattern &&
        fieldSchema instanceof z.ZodString
      ) {
        fieldSchema = fieldSchema.regex(
          new RegExp(input.validation_rules.pattern),
        );
      }
    }

    schemaFields[input.name] = fieldSchema;
  });

  return z.object(schemaFields);
};

type FormData = z.infer<ReturnType<typeof createValidationSchema>>;

export default function AgentChatInfo({ agent, onSubmit }: AgentChatInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = createValidationSchema(agent.required_inputs);
  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: agent.required_inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.name]: input.default_value || "",
      }),
      {} as FormData,
    ),
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (input: RequiredInput) => {
    const error = form.formState.errors[input.name];

    switch (input.type) {
      case "textarea":
        return (
          <Textarea
            {...form.register(input.name)}
            placeholder={input.placeholder || ""}
            className={error ? "border-red-500" : ""}
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => form.setValue(input.name, value)}
            defaultValue={input.default_value || undefined}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue
                placeholder={input.placeholder || "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {input.options.map((option) => (
                <SelectItem
                  key={option.value.toString()}
                  value={option.value.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multiselect":
        // TODO: Implement multiselect
        return null;
      default:
        return (
          <Input
            type={input.type}
            {...form.register(input.name)}
            placeholder={input.placeholder || ""}
            className={error ? "border-red-500" : ""}
          />
        );
    }
  };

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
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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
                {renderInput(input)}
                {form.formState.errors[input.name] && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors[input.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}
    </div>
  );
}
