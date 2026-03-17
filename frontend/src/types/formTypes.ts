export interface ProjectFormValues {
  title: string;
  description: string;
  status: "active" | "completed";
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string; 
}
