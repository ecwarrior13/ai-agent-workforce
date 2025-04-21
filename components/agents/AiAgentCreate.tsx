"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { LLMModel } from "@/actions/getModels";
import { useState } from "react";
import { Switch } from "../ui/switch";
import {
  aiAgentFormSchema,
  AiAgentFormValues,
  avatarOptions,
} from "@/schemas/aiAgent";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";

interface AIAgentCreateProps {
  models: LLMModel[];
}

export default function AIAssistantForm({ models }: AIAgentCreateProps) {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temperatureValue, setTemperatureValue] = useState(0.7);
  // Initialize the form with default values
  const form = useForm<AiAgentFormValues>({
    resolver: zodResolver(aiAgentFormSchema),
    defaultValues: {
      agentName: "AI Crypto Assistant",
      agentRole: "Crypto Trading Assistant",
      agentTone: "Professional and informative",
      modelId: "gpt-4",
      isPublic: false,
      avatarStyle: "default",
      personalityTraits: "Analytical, precise, and helpful",
      values: "Accuracy, transparency, and user education",
      objective: "Help users understand and navigate the crypto market",
      details: "Provide detailed analysis and insights on crypto trading",
      domainKnowledge:
        "Cryptocurrency markets, trading strategies, and blockchain technology",
      knowledgeCutoff: "latest",
      externalResources:
        "Market data, news sources, and technical analysis tools",
      preferredStyle: "Clear and concise",
      responseLength: "Detailed",
      formalityLevel: "neutral",
      restrictions: "No financial advice, only educational content",
      mandatory: "Always cite sources and provide disclaimers",
      proactivityLevel: "Balanced",
      userSkillLevel: "intermediate",
      explanationDepth: "balanced",
      temperature: 0.7,
      creativityLevel: "balanced",
      ambiguityHandling: "Ask for clarification when uncertain",
      feedbackHandling: "Incorporate user feedback to improve responses",
    },
  });

  // Form submission handler
  function onSubmit(data: AiAgentFormValues) {
    console.log(data);
    // Here you would typically save the configuration or use it to initialize your AI assistant
    alert("AI Assistant configuration saved!");
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>AI Assistant Configuration</CardTitle>
          <CardDescription>
            Configure your AI assistant&apos;s behavior and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Agent Identity Section */}
              <div>
                <h3 className="text-lg font-medium">Agent Identity</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="agentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="AI Assistant Name"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agentRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Assistant Role"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agentTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Communication Tone"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Add the AI Model selection here */}
                  <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Model</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedModel(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl className="bg-white">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {models.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Avatar Selection */}
                  <FormField
                    control={form.control}
                    name="avatarStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-2"
                          >
                            {avatarOptions.map((avatar) => (
                              <FormItem
                                key={avatar.id}
                                className="flex flex-col items-center space-y-2"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={avatar.id}
                                    id={avatar.id}
                                    className="sr-only"
                                  />
                                </FormControl>
                                <label
                                  htmlFor={avatar.id}
                                  className={`cursor-pointer flex flex-col items-center space-y-1 ${
                                    field.value === avatar.id
                                      ? "ring-2 ring-primary rounded-full"
                                      : ""
                                  }`}
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={avatar.src || "/placeholder.svg"}
                                      alt={avatar.name}
                                    />
                                    <AvatarFallback>
                                      {avatar.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{avatar.name}</span>
                                </label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Replace Checkbox with Switch for Make Public */}
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Make Public
                          </FormLabel>
                          <FormDescription>
                            Allow others to discover this configuration.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Personality Section - NEW */}
              <div>
                <h3 className="text-lg font-medium">Personality</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="personalityTraits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personality Traits</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the personality traits of your assistant (e.g., friendly, analytical, empathetic)"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Define how your assistant should come across in
                          conversations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="values"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Values & Principles</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Core values and principles your assistant should uphold"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What principles should guide your assistant&apos;s
                          responses?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Task & Purpose Section */}
              <div>
                <h3 className="text-lg font-medium">Task & Purpose</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objective</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Define the assistant's main objective"
                            className="min-h-[80px] bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details about the task"
                            className="min-h-[80px] bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Context & Background Section - ENHANCED */}
              <div>
                <h3 className="text-lg font-medium">Context & Background</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="domainKnowledge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain Knowledge</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Specific knowledge areas the assistant should have"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="knowledgeCutoff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Knowledge Cutoff</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select knowledge cutoff" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="latest">
                              Latest available
                            </SelectItem>
                            <SelectItem value="2023">Up to 2023</SelectItem>
                            <SelectItem value="2022">Up to 2022</SelectItem>
                            <SelectItem value="2021">Up to 2021</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Specify how up-to-date the &apos;s knowledge should
                          be.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="externalResources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Resources</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="External resources the assistant should reference"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List any specific sources, websites, or documents the
                          assistant should reference.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Context & Background Section */}
              <div>
                <h3 className="text-lg font-medium">Context & Background</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="domainKnowledge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain Knowledge</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Specific knowledge areas the assistant should have"
                            className="min-h-[80px] bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Response Format Section */}
              <div>
                <h3 className="text-lg font-medium">Response Format</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferredStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Style</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bullet points, Paragraphs"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responseLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Concise, Detailed"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formalityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formality Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select formality level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How formal should the assistant&apos;s language be?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Special Instructions Section */}
              <div>
                <h3 className="text-lg font-medium">Special Instructions</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="restrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restrictions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Things the assistant should never do"
                            className="min-h-[80px] bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mandatory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mandatory</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Things the assistant must always do"
                            className="min-h-[80px] bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Interaction Style Section - ENHANCED */}
              <div>
                <h3 className="text-lg font-medium">Interaction Style</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="proactivityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proactivity Level</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Passive, Moderately proactive"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userSkillLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target User Skill Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user skill level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          What level of expertise should the assistant assume
                          from users?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="explanationDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Explanation Depth</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select explanation depth" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="brief">Brief</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How detailed should explanations be?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Performance Settings - NEW */}
              <div>
                <h3 className="text-lg font-medium">Performance Settings</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Temperature: {temperatureValue.toFixed(1)}
                        </FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={(value) => {
                              field.onChange(value[0]);
                              setTemperatureValue(value[0]);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Lower values (0.0) make responses more deterministic,
                          higher values (1.0) make responses more creative.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="creativityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creativity Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select creativity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="conservative">
                              Conservative
                            </SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How creative should the assistant&apos;s responses be?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Error Handling Section */}
              {/* Error Handling Section - ENHANCED */}
              <div>
                <h3 className="text-lg font-medium">Error Handling</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="ambiguityHandling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ambiguity Handling</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="How the assistant should handle unclear requests"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="feedbackHandling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback Handling</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="How the assistant should handle user feedback"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specify how the assistant should respond to feedback
                          and corrections.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Configuration
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
