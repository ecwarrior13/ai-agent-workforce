"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskTable } from "./TaskTable";

// Mock data for demonstration
const MOCK_TASKS: Task[] = [
  {
    id: "TASK-8782",
    title: "Implement authentication flow",
    description: "Set up OAuth with Google and email/password authentication",
    status: "in-progress",
    priority: "high",
    dueDate: new Date("2025-05-10"),
    assignee: "Sarah Chen",
    createdAt: new Date("2025-04-20"),
  },
  {
    id: "TASK-7891",
    title: "Design system updates",
    description:
      "Update color palette and typography to match new brand guidelines",
    status: "todo",
    priority: "medium",
    dueDate: new Date("2025-05-15"),
    assignee: "Michael Brown",
    createdAt: new Date("2025-04-21"),
  },
  {
    id: "TASK-6723",
    title: "API integration for user profiles",
    description: "Connect to user profile API and implement data fetching",
    status: "done",
    priority: "medium",
    dueDate: new Date("2025-04-22"),
    assignee: "Alex Johnson",
    createdAt: new Date("2025-04-15"),
  },
  {
    id: "TASK-5519",
    title: "Fix responsive layout issues on mobile",
    description:
      "Task table and navigation menu have display issues on devices under 375px width",
    status: "blocked",
    priority: "urgent",
    dueDate: new Date("2025-04-24"),
    assignee: "Jane Smith",
    createdAt: new Date("2025-04-18"),
  },
  {
    id: "TASK-4492",
    title: "Implement analytics tracking",
    description: "Add Google Analytics events for key user interactions",
    status: "todo",
    priority: "low",
    dueDate: new Date("2025-05-30"),
    assignee: "David Wilson",
    createdAt: new Date("2025-04-22"),
  },
  {
    id: "TASK-3381",
    title: "Database performance optimization",
    description:
      "Optimize SQL queries that are causing slow loads on the tasks page",
    status: "in-progress",
    priority: "high",
    dueDate: new Date("2025-05-05"),
    assignee: "Emily Zhang",
    createdAt: new Date("2025-04-19"),
  },
  {
    id: "TASK-2264",
    title: "User testing session",
    description: "Conduct usability testing sessions with 5 participants",
    status: "todo",
    priority: "medium",
    dueDate: new Date("2025-05-12"),
    assignee: "Sarah Chen",
    createdAt: new Date("2025-04-22"),
  },
  {
    id: "TASK-1198",
    title: "Documentation update",
    description: "Update API documentation with new endpoints",
    status: "done",
    priority: "low",
    dueDate: new Date("2025-04-28"),
    assignee: "Robert Taylor",
    createdAt: new Date("2025-04-18"),
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: null,
    assignee: "",
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleCreateTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: `TASK-${Math.floor(Math.random() * 10000)}`,
      title: newTask.title || "",
      description: newTask.description || "",
      status: (newTask.status as Task["status"]) || "todo",
      priority: (newTask.priority as Task["priority"]) || "medium",
      dueDate: date || null,
      assignee: newTask.assignee || "",
      createdAt: new Date(),
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: null,
      assignee: "",
    });
    setDate(undefined);
    setOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new task.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        status: value as Task["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as Task["priority"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignee: e.target.value })
                    }
                    placeholder="Assignee name"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <TaskTable tasks={tasks} />
      </div>
    </div>
  );
}
