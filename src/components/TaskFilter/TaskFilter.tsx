import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { TaskFilterProps } from "../../types";

export const TaskFilter: React.FC<TaskFilterProps> = ({
  searchTerm,
  statusFilter,
  priorityFilter,
  sortBy,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortChange,
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchTerm !== "" || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Filter & Sort Tasks
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        {/* Search */}
        <TextField
          label="Search tasks"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or description..."
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
        />

        {/* Status Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Status"
            onChange={(e) =>
              onStatusFilterChange(e.target.value as typeof statusFilter)
            }
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
          </Select>
        </FormControl>

        {/* Priority Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel id="priority-filter-label">Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            id="priority-filter"
            value={priorityFilter}
            label="Priority"
            onChange={(e) =>
              onPriorityFilterChange(e.target.value as typeof priorityFilter)
            }
          >
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" fullWidth>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by"
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Box>
  );
};
