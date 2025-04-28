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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Define the input types
export type InputType =
  | "text"
  | "number"
  | "url"
  | "email"
  | "date"
  | "select"
  | "multiselect"
  | "file"
  | "textarea";

// Define the validation rules type
export type ValidationRule = {
  type: string;
  value?: string | number | boolean;
  message: string;
};

// Define the required input type
export type RequiredInput = {
  id?: string;
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
    id: "",
    name: "",
    label: "",
    type: "text",
    description: "",
    isRequired: true,
    validationRules: [],
  });

  const handleAddInput = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* <h3 className="text-lg font-semibold">Required Inputs</h3> */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddInput}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Input
        </Button>
      </div>

      {/* Input List */}
      <div className="space-y-4">
        {inputs.map((input, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Name</Label>
                  <Input
                    value={input.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    placeholder="e.g., youtube_url"
                    className="max-w-xs bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Label</Label>
                  <Input
                    value={input.label}
                    onChange={(e) =>
                      handleInputChange(index, "label", e.target.value)
                    }
                    placeholder="e.g., YouTube Video URL"
                    className="max-w-xs bg-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Type</Label>
                  <Select
                    value={input.type}
                    onValueChange={(value) =>
                      handleInputChange(index, "type", value)
                    }
                  >
                    <SelectTrigger className="max-w-xs bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="multiselect">Multi-select</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Required</Label>
                  <Switch
                    checked={input.isRequired}
                    onCheckedChange={(checked) =>
                      handleInputChange(index, "isRequired", checked)
                    }
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveInput(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New Input Form */}
      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="text-sm font-medium">Add New Input</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label>Name</Label>
            <Input
              value={newInput.name}
              onChange={(e) =>
                setNewInput({ ...newInput, name: e.target.value })
              }
              placeholder="e.g., youtube_url"
              className="max-w-xs bg-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Label</Label>
            <Input
              value={newInput.label}
              onChange={(e) =>
                setNewInput({ ...newInput, label: e.target.value })
              }
              placeholder="e.g., YouTube Video URL"
              className="max-w-xs bg-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Type</Label>
            <Select
              value={newInput.type}
              onValueChange={(value) =>
                setNewInput({ ...newInput, type: value as InputType })
              }
            >
              <SelectTrigger className="max-w-xs bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="multiselect">Multi-select</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label>Required</Label>
            <Switch
              checked={newInput.isRequired}
              onCheckedChange={(checked) =>
                setNewInput({ ...newInput, isRequired: checked })
              }
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
