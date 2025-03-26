import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
}

interface TasksState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.tasks.push(newTask)
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
  },
})

export const { addTask, toggleTaskCompletion, updateTask, deleteTask } = tasksSlice.actions

export default tasksSlice.reducer

