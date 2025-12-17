import type { Dayjs } from "dayjs";

export type statusType = "new" | "in progress" | "complete";
export type priorityType = "High" | "Medium" | "Low";

export interface TaskDataProps {
  id: string;
  name: string;
  description: string;
  dueDate?: string;
  status: statusType;
  priority: priorityType;
}

export interface TaskFormProps {
  name: string;
  description: string;
  dueDate: Dayjs | null;
  status: statusType;
  priority: priorityType;
  editingTaskId: string | null;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Dayjs | null) => void;
  onStatusChange: (status: statusType) => void;
  onPriorityChange: (priority: priorityType) => void;
  onSubmit: () => void;
  onCancel: () => void;
  errors: {
    name?: string;
    description?: string;
    dueDate?: string;
  };
}

export interface TaskListProps {
  tasks: TaskDataProps[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export interface TaskFilterProps {
  searchTerm: string;
  statusFilter: statusType | "all";
  priorityFilter: priorityType | "all";
  sortBy: "dueDate" | "priority" | "status" | "name";
  onSearchChange: (searchTerm: string) => void;
  onStatusFilterChange: (status: statusType | "all") => void;
  onPriorityFilterChange: (priority: priorityType | "all") => void;
  onSortChange: (sortBy: "dueDate" | "priority" | "status" | "name") => void;
  onClearFilters: () => void;
}
