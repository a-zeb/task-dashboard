import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Box, Typography, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TaskListProps, TaskDataProps } from "../../types";
import { formatDate } from "../../utils/taskUtils";

export const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const columns: GridColDef<TaskDataProps>[] = [
    {
      field: "name",
      headerName: "Task Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 120,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams<TaskDataProps>) => {
        const colors = {
          new: "info",
          "in progress": "warning",
          complete: "success",
        } as const;
        return (
          <Chip
            label={params.value}
            color={colors[params.value as keyof typeof colors]}
            size="small"
          />
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params: GridRenderCellParams<TaskDataProps>) => {
        const colors = {
          High: "error",
          Medium: "warning",
          Low: "default",
        } as const;
        return (
          <Chip
            label={params.value}
            color={colors[params.value as keyof typeof colors]}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<TaskDataProps>) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(params.row.id)}
            aria-label="edit task"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(params.row.id)}
            aria-label="delete task"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No tasks found. Create your first task to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
};
