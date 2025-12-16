export interface TaskDataProps {
    id: string,
    name: string,
    description: string,
    dueDate: string,
    status: "new" | "in progress" | "complete"
}