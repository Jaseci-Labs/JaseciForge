"use client";

import { useAppDispatch, useAppSelector } from "@/store/useStore";
import {
  addTask,
  deleteTask,
  toggleTaskCompletion,
  updateTask,
} from "@/store/tasksSlice";
import type { TaskNode } from "@/nodes/task-node";

export function useTaskManager() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  // Task statistics
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = totalTasks - activeTasks;

  // Task priorities
  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
  const mediumPriorityTasks = tasks.filter(
    (t) => t.priority === "medium"
  ).length;
  const lowPriorityTasks = tasks.filter((t) => t.priority === "low").length;

  // Task actions
  const handleAddTask = (taskData: Omit<TaskNode, "id" | "completed">) => {
    dispatch(addTask(taskData));
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleTaskCompletion(id));
  };

  const handleUpdateTask = (task: TaskNode) => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  return {
    tasks,
    stats: {
      total: totalTasks,
      active: activeTasks,
      completed: completedTasks,
      priorities: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
    },
    actions: {
      addTask: handleAddTask,
      toggleComplete: handleToggleComplete,
      updateTask: handleUpdateTask,
      deleteTask: handleDeleteTask,
    },
  };
}
