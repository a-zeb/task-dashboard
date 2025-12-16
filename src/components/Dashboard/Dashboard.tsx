import { Container, Grid } from "@mui/material";
import { TaskForm } from "../TaskForm/TaskForm";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskList } from "../TaskList/TaskList";

export const Dashboard: React.FC = () => {
  return (
    <Container>
      <Grid>
        <h1>Task Dashboard</h1>
        <TaskForm />
        <TaskFilter />
        <TaskList />
      </Grid>
    </Container>
  );
};
