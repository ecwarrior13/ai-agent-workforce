"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Copy,
  Plus,
  Settings,
  Trash2,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";

// Add constant for maximum required inputs
const MAX_REQUIRED_INPUTS = 4;

// Define the input types
export type InputType =
  | "text"
  | "number"
  | "url"
  | "email"
  | "date"
  | "textarea";

// Define the validation rules type
export type ValidationRule = {
  type: string;
  value?: string | number | boolean;
  message: string;
};

// Define the required input type
export type RequiredInput = {
  id: string; // Changed from optional to required to fix TypeScript error
  name: string;
  label: string;
  description?: string;
  type: InputType;
  isRequired: boolean;
  validationRules: ValidationRule[];
  options?: { label: string; value: string }[]; // For select/multiselect
  placeholder?: string;
  defaultValue?: string;
};

interface RequiredInputsProps {
  onInputsChange: (inputs: RequiredInput[]) => void;
  initialInputs?: RequiredInput[];
}

export function RequiredInputs({
  onInputsChange,
  initialInputs = [],
}: RequiredInputsProps) {
  const [inputs, setInputs] = useState<RequiredInput[]>(initialInputs);
  const [newInput, setNewInput] = useState<RequiredInput>({
    id: "", // This will be filled in when adding the input
    name: "",
    label: "",
    type: "text",
    description: "",
    isRequired: true,
    validationRules: [],
  });
  const [expandedInput, setExpandedInput] = useState<string | null>(null);

  const handleAddInput = () => {
    if (inputs.length >= MAX_REQUIRED_INPUTS) {
      toast.error(`Maximum of ${MAX_REQUIRED_INPUTS} inputs allowed`);
      return;
    }

    if (!newInput.name || !newInput.label) {
      toast.error("Name and label are required");
      return;
    }

    // Check for duplicate names
    if (inputs.some((input) => input.name === newInput.name)) {
      toast.error("Input name must be unique");
      return;
    }

    const inputToAdd = {
      ...newInput,
      id: Date.now().toString(),
    };

    setInputs([inputToAdd, ...inputs]);
    onInputsChange([inputToAdd, ...inputs]);
    setNewInput({
      id: "",
      name: "",
      label: "",
      type: "text",
      description: "",
      isRequired: true,
      validationRules: [],
    });
  };

  const handleRemoveInput = (index: number) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
    onInputsChange(updatedInputs);
  };

  const handleInputChange = (
    index: number,
    field: keyof RequiredInput,
    value: string | boolean,
  ) => {
    const updatedInputs = inputs.map((input, i) => {
      if (i === index) {
        return { ...input, [field]: value };
      }
      return input;
    });
    setInputs(updatedInputs);
    onInputsChange(updatedInputs);
  };

  const handleMoveInput = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === inputs.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedInputs = [...inputs];
    const temp = updatedInputs[index];
    updatedInputs[index] = updatedInputs[newIndex];
    updatedInputs[newIndex] = temp;

    setInputs(updatedInputs);
    onInputsChange(updatedInputs);
  };

  const handleDuplicateInput = (index: number) => {
    const inputToDuplicate = inputs[index];
    const duplicatedInput = {
      ...inputToDuplicate,
      id: Date.now().toString(),
      name: `${inputToDuplicate.name}_copy`,
      label: `${inputToDuplicate.label} (Copy)`,
    };

    setInputs([...inputs, duplicatedInput]);
    onInputsChange([...inputs, duplicatedInput]);
    toast.success(`Duplicated ${inputToDuplicate.label} field`);
  };

  const toggleExpandInput = (id: string) => {
    setExpandedInput(expandedInput === id ? null : id);
  };

  const getTypeIcon = (type: InputType) => {
    switch (type) {
      case "text":
      case "textarea":
        return <Type className="h-4 w-4" />;
      case "number":
        return <span className="text-xs font-medium">123</span>;
      case "url":
        return <span className="text-xs font-medium">URL</span>;
      case "email":
        return <span className="text-xs font-medium">@</span>;
      case "date":
        return <span className="text-xs font-medium">📅</span>;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Form Fields</h3>
          <Badge variant="outline" className="text-xs">
            {inputs.length}/{MAX_REQUIRED_INPUTS}{" "}
            {inputs.length === 1 ? "field" : "fields"}
          </Badge>
        </div>
      </div>

      {/* New Input Form Accordion with no bottom border */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="new" className="border-b-0">
          <AccordionTrigger
            className="px-4 py-2 hover:no-underline"
            disabled={inputs.length >= MAX_REQUIRED_INPUTS}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Field</span>
              {inputs.length >= MAX_REQUIRED_INPUTS && (
                <span className="text-muted-foreground ml-2 text-xs">
                  (Maximum limit reached)
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Row 1: Field Name and Field Type */}
              <div className="flex gap-4">
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="new-name">
                    Field Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={newInput.name}
                    onChange={(e) =>
                      setNewInput({ ...newInput, name: e.target.value })
                    }
                    placeholder="e.g., youtube_url"
                    className="bg-white"
                  />
                  <p className="text-muted-foreground text-xs">
                    Used as the field identifier in form data
                  </p>
                </div>

                <div className="w-1/2 space-y-2">
                  <Label htmlFor="new-type">Field Type</Label>
                  <Select
                    value={newInput.type}
                    onValueChange={(value) =>
                      setNewInput({ ...newInput, type: value as InputType })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Display Label and Placeholder */}
              <div className="flex gap-4">
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="new-label">
                    Display Label <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={newInput.label}
                    onChange={(e) =>
                      setNewInput({ ...newInput, label: e.target.value })
                    }
                    placeholder="e.g., YouTube Video URL"
                    className="bg-white"
                  />
                  <p className="text-muted-foreground text-xs">
                    Shown to users above the input field
                  </p>
                </div>

                <div className="w-1/2 space-y-2">
                  <Label htmlFor="new-placeholder">Placeholder</Label>
                  <Input
                    id="new-placeholder"
                    value={newInput.placeholder || ""}
                    onChange={(e) =>
                      setNewInput({ ...newInput, placeholder: e.target.value })
                    }
                    placeholder="e.g., Enter a valid YouTube URL"
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Row 3: Required Field switch */}
              <div className="flex items-center justify-between">
                <Label htmlFor="new-required" className="cursor-pointer">
                  Required Field
                </Label>
                <Switch
                  checked={newInput.isRequired}
                  onCheckedChange={(checked) =>
                    setNewInput({ ...newInput, isRequired: checked })
                  }
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                />
              </div>

              {/* Row 4: Help Text - full width */}
              <div className="w-full space-y-2">
                <Label htmlFor="new-description">Help Text</Label>
                <Textarea
                  id="new-description"
                  value={newInput.description || ""}
                  onChange={(e) =>
                    setNewInput({ ...newInput, description: e.target.value })
                  }
                  placeholder="Additional information to help users complete this field"
                  rows={2}
                  className="w-full bg-white"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleAddInput}
                >
                  Add Field
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Input List */}
      {inputs.length > 0 ? (
        <div className="space-y-2">
          {inputs.map((input, index) => (
            <Card key={input.id} className="overflow-hidden border">
              <Accordion
                type="single"
                collapsible
                value={expandedInput === input.id ? input.id : undefined}
                onValueChange={(value) => toggleExpandInput(input.id)}
              >
                <AccordionItem value={input.id} className="border-0">
                  <div className="flex items-center px-4 py-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                        {getTypeIcon(input.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium">{input.label}</h4>
                        <p className="text-muted-foreground truncate text-xs">
                          {input.name} • {input.type}
                          {input.isRequired && " • required"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveInput(index, "up");
                        }}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveInput(index, "down");
                        }}
                        disabled={index === inputs.length - 1}
                        className="h-8 w-8"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <AccordionTrigger className="h-8 w-8 p-0 hover:no-underline">
                        <Settings className="h-4 w-4" />
                      </AccordionTrigger>
                    </div>
                  </div>
                  <AccordionContent className="border-t px-4 pt-4 pb-4">
                    <div className="space-y-4">
                      {/* Row 1: Field Name and Field Type */}
                      <div className="flex gap-4">
                        <div className="w-1/2 space-y-2">
                          <Label htmlFor={`name-${input.id}`}>
                            Field Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`name-${input.id}`}
                            value={input.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            className="bg-white"
                          />
                        </div>

                        <div className="w-1/2 space-y-2">
                          <Label htmlFor={`type-${input.id}`}>Field Type</Label>
                          <Select
                            value={input.type}
                            onValueChange={(value) =>
                              handleInputChange(index, "type", value)
                            }
                          >
                            <SelectTrigger
                              id={`type-${input.id}`}
                              className="bg-white"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">
                                Text Area
                              </SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 2: Display Label and Placeholder */}
                      <div className="flex gap-4">
                        <div className="w-1/2 space-y-2">
                          <Label htmlFor={`label-${input.id}`}>
                            Display Label{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`label-${input.id}`}
                            value={input.label}
                            onChange={(e) =>
                              handleInputChange(index, "label", e.target.value)
                            }
                            className="bg-white"
                          />
                        </div>

                        <div className="w-1/2 space-y-2">
                          <Label htmlFor={`placeholder-${input.id}`}>
                            Placeholder
                          </Label>
                          <Input
                            id={`placeholder-${input.id}`}
                            value={input.placeholder || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "placeholder",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Enter your answer here"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      {/* Row 3: Required Field switch */}
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={`required-${input.id}`}
                          className="cursor-pointer"
                        >
                          Required Field
                        </Label>
                        <Switch
                          id={`required-${input.id}`}
                          checked={input.isRequired}
                          onCheckedChange={(checked) =>
                            handleInputChange(index, "isRequired", checked)
                          }
                        />
                      </div>

                      {/* Row 4: Help Text - full width */}
                      <div className="w-full space-y-2">
                        <Label htmlFor={`description-${input.id}`}>
                          Help Text
                        </Label>
                        <Textarea
                          id={`description-${input.id}`}
                          value={input.description || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Additional information to help users"
                          rows={2}
                          className="w-full bg-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateInput(index)}
                      >
                        <Copy className="mr-1 h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveInput(index)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="text-muted-foreground h-8 w-8" />
            <h3 className="font-medium">No fields added yet</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Start building your form by adding fields. Click the Add Field
              button to get started.
            </p>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="mt-2"
              onClick={() => {
                /* Add your first field action */
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Your First Field
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
