import type { TaskDataProps, statusType, priorityType } from "../types";
import dayjs from "dayjs";

/**
 * Generates a unique task ID using timestamp and random string
 */
export const generateTaskId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Formats an ISO date string to MM/DD/YYYY format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "No due date";
  return dayjs(dateString).format("MM/DD/YYYY");
};

/**
 * Validates a task object and returns validation errors
 */
export const validateTask = (task: {
  name: string;
  description: string;
  dueDate: string | null;
}): { name?: string; description?: string; dueDate?: string } => {
  const errors: { name?: string; description?: string; dueDate?: string } = {};

  // Validate name
  if (!task.name || task.name.trim().length === 0) {
    errors.name = "Task name is required";
  } else if (task.name.trim().length < 3) {
    errors.name = "Task name must be at least 3 characters";
  }

  // Validate description (optional but if provided must be at least 5 chars)
  if (
    task.description &&
    task.description.trim().length > 0 &&
    task.description.trim().length < 5
  ) {
    errors.description = "Description must be at least 5 characters";
  }

  // Validate due date (must be today or future)
  if (task.dueDate) {
    const dueDate = dayjs(task.dueDate);
    const today = dayjs().startOf("day");
    if (dueDate.isBefore(today)) {
      errors.dueDate = "Due date must be today or in the future";
    }
  }

  return errors;
};

/**
 * Filters tasks based on search term, status, and priority
 */
export const filterTasks = (
  tasks: TaskDataProps[],
  searchTerm: string,
  statusFilter: statusType | "all",
  priorityFilter: priorityType | "all"
): TaskDataProps[] => {
  return tasks.filter((task) => {
    // Filter by search term (matches name or description)
    const matchesSearch =
      searchTerm === "" ||
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    // Filter by priority
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
};

/**
 * Sorts tasks based on the specified criteria
 */
export const sortTasks = (
  tasks: TaskDataProps[],
  sortBy: "dueDate" | "priority" | "status" | "name"
): TaskDataProps[] => {
  const tasksCopy = [...tasks];

  switch (sortBy) {
    case "dueDate":
      return tasksCopy.sort((a, b) => {
        // Tasks without due dates go to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix();
      });

    case "priority": {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return tasksCopy.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    case "status": {
      const statusOrder = { new: 0, "in progress": 1, complete: 2 };
      return tasksCopy.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
      );
    }

    case "name":
      return tasksCopy.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return tasksCopy;
  }
};

/**
 * Saves tasks to localStorage
 */
export const saveTasksToLocalStorage = (tasks: TaskDataProps[]): void => {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
};

/**
 * Loads tasks from localStorage
 */
export const loadTasksFromLocalStorage = (): TaskDataProps[] => {
  try {
    const tasksJson = localStorage.getItem("tasks");
    if (tasksJson) {
      return JSON.parse(tasksJson);
    }
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
  }
  return [];
};

/**
 * Exports tasks to a JSON file
 */
export const exportTasksToJSON = (tasks: TaskDataProps[]): void => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tasks-${dayjs().format("YYYY-MM-DD")}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Imports tasks from a JSON file
 */
export const importTasksFromJSON = (file: File): Promise<TaskDataProps[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tasks = JSON.parse(e.target?.result as string);
        if (Array.isArray(tasks)) {
          resolve(tasks);
        } else {
          reject(new Error("Invalid JSON format: expected an array of tasks"));
        }
      } catch {
        reject(new Error("Failed to parse JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
