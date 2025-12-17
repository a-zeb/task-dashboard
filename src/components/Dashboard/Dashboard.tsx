import { Container, Box, Typography, Paper, Chip, IconButton, Tooltip, Button } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { TaskForm } from "../TaskForm/TaskForm";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskList } from "../TaskList/TaskList";
import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { statusType, priorityType, TaskDataProps } from "../../types";
import {
  generateTaskId,
  validateTask,
  filterTasks,
  sortTasks,
  saveTasksToLocalStorage,
  loadTasksFromLocalStorage,
  exportTasksToJSON,
  importTasksFromJSON,
} from "../../utils/taskUtils";

interface DashboardProps {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ themeMode, onToggleTheme }) => {
  // Task list state - initialize from localStorage
  const [tasks, setTasks] = useState<TaskDataProps[]>(() => loadTasksFromLocalStorage());

  // Form state
  const [taskNameForm, setTaskNameForm] = useState("");
  const [taskDescriptionForm, setTaskDescriptionForm] = useState("");
  const [dateForm, setDateForm] = useState<Dayjs | null>(null);
  const [formStatus, setFormStatus] = useState<statusType>("new");
  const [formPriority, setFormPriority] = useState<priorityType>("Medium");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
    dueDate?: string;
  }>({});

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<priorityType | "all">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "status" | "name">("dueDate");

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || tasks.length === 0) {
      saveTasksToLocalStorage(tasks);
    }
  }, [tasks]);

  // Handle form submission (create or update task)
  const handleSubmit = () => {
    // Validate form
    const errors = validateTask({
      name: taskNameForm,
      description: taskDescriptionForm,
      dueDate: dateForm ? dateForm.toISOString() : null,
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingTaskId) {
      // Update existing task
      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              name: taskNameForm,
              description: taskDescriptionForm,
              dueDate: dateForm ? dateForm.toISOString() : undefined,
              status: formStatus,
              priority: formPriority,
            }
          : task
      );
      setTasks(updatedTasks);
    } else {
      // Create new task
      const newTask: TaskDataProps = {
        id: generateTaskId(),
        name: taskNameForm,
        description: taskDescriptionForm,
        dueDate: dateForm ? dateForm.toISOString() : undefined,
        status: formStatus,
        priority: formPriority,
      };
      setTasks([...tasks, newTask]);
    }

    // Clear form
    clearForm();
  };

  // Clear form and reset to default state
  const clearForm = () => {
    setTaskNameForm("");
    setTaskDescriptionForm("");
    setDateForm(null);
    setFormStatus("new");
    setFormPriority("Medium");
    setEditingTaskId(null);
    setFormErrors({});
  };

  // Start editing a task
  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setTaskNameForm(taskToEdit.name);
      setTaskDescriptionForm(taskToEdit.description);
      setDateForm(taskToEdit.dueDate ? dayjs(taskToEdit.dueDate) : null);
      setFormStatus(taskToEdit.status);
      setFormPriority(taskToEdit.priority);
      setEditingTaskId(taskId);
      setFormErrors({});
    }
  };

  // Delete a task with confirmation
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    if (taskToDelete && window.confirm(`Are you sure you want to delete "${taskToDelete.name}"?`)) {
      setTasks(tasks.filter((task) => task.id !== taskId));
      // If we were editing this task, clear the form
      if (editingTaskId === taskId) {
        clearForm();
      }
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("dueDate");
  };

  // Export tasks to JSON file
  const handleExportTasks = () => {
    exportTasksToJSON(tasks);
  };

  // Import tasks from JSON file
  const handleImportTasks = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedTasks = await importTasksFromJSON(file);
        if (window.confirm(`Import ${importedTasks.length} tasks? This will replace your current tasks.`)) {
          setTasks(importedTasks);
        }
      } catch (error) {
        alert(`Failed to import tasks: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    // Reset file input
    event.target.value = "";
  };

  // Apply filters and sorting to tasks
  const filteredTasks = filterTasks(tasks, searchTerm, statusFilter, priorityFilter);
  const sortedTasks = sortTasks(filteredTasks, sortBy);

  // Calculate statistics
  const totalTasks = tasks.length;
  const newTasks = tasks.filter((task) => task.status === "new").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in progress").length;
  const completedTasks = tasks.filter((task) => task.status === "complete").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h3" component="h1">
          Task Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Export tasks to JSON">
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportTasks}
              disabled={tasks.length === 0}
            >
              Export
            </Button>
          </Tooltip>
          <Tooltip title="Import tasks from JSON">
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileUploadIcon />}
              component="label"
            >
              Import
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImportTasks}
              />
            </Button>
          </Tooltip>
          <Tooltip title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Task Statistics */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Paper sx={{ p: 2, textAlign: "center", flex: "1 1 180px", minWidth: "180px" }}>
          <Typography variant="h4">{totalTasks}</Typography>
          <Typography variant="body2" color="text.secondary">
            Total Tasks
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center", flex: "1 1 180px", minWidth: "180px" }}>
          <Typography variant="h4">{newTasks}</Typography>
          <Typography variant="body2" color="text.secondary">
            New
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center", flex: "1 1 180px", minWidth: "180px" }}>
          <Typography variant="h4">{inProgressTasks}</Typography>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center", flex: "1 1 180px", minWidth: "180px" }}>
          <Typography variant="h4">{completedTasks}</Typography>
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center", flex: "1 1 180px", minWidth: "180px" }}>
          <Typography variant="h4">{completionPercentage}%</Typography>
          <Typography variant="body2" color="text.secondary">
            Completion
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        {/* Task Form */}
        <Box sx={{ flex: "0 0 auto", width: { xs: "100%", md: "350px" } }}>
          <Paper sx={{ p: 3 }}>
            <TaskForm
              name={taskNameForm}
              description={taskDescriptionForm}
              dueDate={dateForm}
              status={formStatus}
              priority={formPriority}
              editingTaskId={editingTaskId}
              onNameChange={setTaskNameForm}
              onDescriptionChange={setTaskDescriptionForm}
              onDateChange={setDateForm}
              onStatusChange={setFormStatus}
              onPriorityChange={setFormPriority}
              onSubmit={handleSubmit}
              onCancel={clearForm}
              errors={formErrors}
            />
          </Paper>
        </Box>

        {/* Task List and Filters */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <TaskFilter
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onPriorityFilterChange={setPriorityFilter}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Tasks ({sortedTasks.length} of {totalTasks})
              </Typography>
              {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
                <Box sx={{ mt: 1 }}>
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => setSearchTerm("")}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {statusFilter !== "all" && (
                    <Chip
                      label={`Status: ${statusFilter}`}
                      onDelete={() => setStatusFilter("all")}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {priorityFilter !== "all" && (
                    <Chip
                      label={`Priority: ${priorityFilter}`}
                      onDelete={() => setPriorityFilter("all")}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                </Box>
              )}
            </Box>
            <TaskList tasks={sortedTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
