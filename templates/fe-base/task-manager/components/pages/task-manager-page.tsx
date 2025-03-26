"use client"

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addTask, toggleTaskCompletion, updateTask, deleteTask, type Task } from "@/lib/redux/tasksSlice"
import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { TaskList } from "@/components/organisms/task-list"
import { Button } from "@/components/atoms/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export function TaskManagerPage() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const { theme, setTheme } = useTheme()

  const handleAddTask = (taskData: Omit<Task, "id" | "completed">) => {
    dispatch(addTask(taskData))
  }

  const handleToggleComplete = (id: string) => {
    dispatch(toggleTaskCompletion(id))
  }

  const handleUpdateTask = (task: Task) => {
    dispatch(updateTask(task))
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))
  }

  const header = (
    <div className="flex items-center justify-between h-16 px-6">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </Button>
    </div>
  )

  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-card rounded-lg border text-center">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="p-3 bg-card rounded-lg border text-center">
            <div className="text-2xl font-bold">{tasks.filter((t) => !t.completed).length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Priorities</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>High</span>
            <span>{tasks.filter((t) => t.priority === "high").length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Medium</span>
            <span>{tasks.filter((t) => t.priority === "medium").length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Low</span>
            <span>{tasks.filter((t) => t.priority === "low").length}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DashboardTemplate header={header} sidebar={sidebar}>
      <TaskList
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />
    </DashboardTemplate>
  )
}

