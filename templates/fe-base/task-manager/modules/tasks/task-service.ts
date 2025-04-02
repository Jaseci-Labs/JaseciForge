import { user_api, walker_api } from "../../_core/api-client";
import type { Task } from "@/store/tasksSlice";

export const TasksApi = {
  getUserTasks: async () => {
    const response = await walker_api.post("/walker/tasks");
    return response.data;
  },

  createTask: async (task: Omit<Task, "id">) => {
    const response = await walker_api.post("/walker/tasks", task);
    return response.data;
  },

  updateTask: async (id: string, task: Partial<Task>) => {
    const response = await walker_api.post(`/walker/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await walker_api.post(`/walker/tasks/${id}`);
    return response.data;
  },

  toggleTaskCompletion: async (id: string) => {
    const response = await walker_api.post(`/walker/tasks/${id}/toggle`);
    return response.data;
  },
};
