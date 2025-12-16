import { Container, Grid } from "@mui/material";
import { TaskForm } from "../TaskForm/TaskForm";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskList } from "../TaskList/TaskList";
import { useState } from "react";
import { Dayjs } from "dayjs";

export const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Dayjs | null>(null);

  const handleDateChange = (date: Dayjs) => {
    setDate(date);
    
    const formattedDate = date.format('MM/DD/YYYY')
    console.log(formattedDate)
  }

  return (
    <Container>
      <Grid>
        <h1>Task Dashboard</h1>
        <TaskForm date={date} onDateChange={handleDateChange} />
        <TaskFilter />
        <TaskList />
      </Grid>
    </Container>
  );
};
