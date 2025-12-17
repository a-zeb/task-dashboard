import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { TaskFormProps } from "../../types";

export const TaskForm = (props: TaskFormProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {props.editingTaskId ? "Edit Task" : "Create New Task"}
      </Typography>
      <FormControl fullWidth sx={{ gap: 2 }}>
        {/* Task Name */}
        <TextField
          label="Task Name"
          variant="outlined"
          value={props.name}
          onChange={(e) => props.onNameChange(e.target.value)}
          error={!!props.errors.name}
          helperText={props.errors.name}
          required
          fullWidth
        />

        {/* Description */}
        <TextField
          label="Description"
          variant="outlined"
          value={props.description}
          onChange={(e) => props.onDescriptionChange(e.target.value)}
          error={!!props.errors.description}
          helperText={props.errors.description}
          multiline
          rows={3}
          fullWidth
        />

        {/* Due Date */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Due Date"
              value={props.dueDate}
              onChange={(value) => props.onDateChange(value)}
              slotProps={{
                textField: {
                  error: !!props.errors.dueDate,
                  helperText: props.errors.dueDate,
                  fullWidth: true,
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>

        {/* Status */}
        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={props.status}
            label="Status"
            onChange={(e) => props.onStatusChange(e.target.value as typeof props.status)}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
          </Select>
        </FormControl>

        {/* Priority */}
        <FormControl fullWidth>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            id="priority-select"
            value={props.priority}
            label="Priority"
            onChange={(e) => props.onPriorityChange(e.target.value as typeof props.priority)}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            type="submit"
            size="medium"
            variant="outlined"
            onClick={props.onSubmit}
            fullWidth
          >
            {props.editingTaskId ? "Update Task" : "Create Task"}
          </Button>
          {props.editingTaskId && (
            <Button
              size="medium"
              variant="outlined"
              onClick={props.onCancel}
              sx={{ minWidth: "100px" }}
            >
              Cancel
            </Button>
          )}
        </Box>

        {Object.keys(props.errors).length > 0 && (
          <FormHelperText error>
            Please fix the errors above before submitting.
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};
