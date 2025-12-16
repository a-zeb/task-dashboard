import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "taskName",
    headerName: "Task",
    width: 150,
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
    editable: true,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    width: 160,
    valueGetter: (value, row) =>
      `${row.taskName || ""} ${row.description || ""}`,
  },
];

const rows = [
  { id: 1, description: "Snow", taskName: "Jon", dueDate: 14 },
  { id: 2, description: "Lannister", taskName: "Cersei", dueDate: 31 },
  { id: 3, description: "Lannister", taskName: "Jaime", dueDate: 31 },
  { id: 4, description: "Stark", taskName: "Arya", dueDate: 11 },
  { id: 5, description: "Targaryen", taskName: "Daenerys", dueDate: null },
  { id: 6, description: "Melisandre", taskName: null, dueDate: 150 },
  { id: 7, description: "Clifford", taskName: "Ferrara", dueDate: 44 },
  { id: 8, description: "Frances", taskName: "Rossini", dueDate: 36 },
  { id: 9, description: "Roxie", taskName: "Harvey", dueDate: 65 },
];

export const TaskList: React.FC = () => {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
