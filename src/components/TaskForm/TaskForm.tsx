import { Box, Button, FormControl, TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const TaskForm = (props) => {
  return (
    <Box>
      <h3>Create a new task</h3>
      <FormControl variant="outlined" fullWidth style={{ gap: "2rem" }}>
        <TextField
          label="Task Name"
          variant="outlined"
          // type="text"
          // value={props.hello}
          // onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          // type="text"
          // value={props.hello}
          // onChange={(e) => setEmail(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Due Date"
              value={props.date}
              onChange={(value) => {
                props.onDateChange(value);
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          label="Status"
          variant="outlined"
          // type="text"
          // value={props.hello}
          // onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          size="medium"
          variant="contained"
          onClick={() => {
            alert(props.date);
          }}
          style={{ maxWidth: "20%" }}
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
};
