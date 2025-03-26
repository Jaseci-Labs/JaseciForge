import { render, screen, fireEvent } from "@testing-library/react"
import { TaskItem } from "./task-item"

const mockTask = {
  id: "1",
  title: "Test Task",
  description: "This is a test task",
  completed: false,
  priority: "medium" as const,
}

describe("TaskItem", () => {
  const mockToggleComplete = jest.fn()
  const mockEdit = jest.fn()
  const mockDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders task details correctly", () => {
    render(<TaskItem task={mockTask} onToggleComplete={mockToggleComplete} onEdit={mockEdit} onDelete={mockDelete} />)

    expect(screen.getByText("Test Task")).toBeInTheDocument()
    expect(screen.getByText("This is a test task")).toBeInTheDocument()
    expect(screen.getByText("medium")).toBeInTheDocument()
  })

  it("calls onToggleComplete when checkbox is clicked", () => {
    render(<TaskItem task={mockTask} onToggleComplete={mockToggleComplete} onEdit={mockEdit} onDelete={mockDelete} />)

    fireEvent.click(screen.getByRole("checkbox"))
    expect(mockToggleComplete).toHaveBeenCalledWith("1")
  })

  it("calls onEdit when edit button is clicked", () => {
    render(<TaskItem task={mockTask} onToggleComplete={mockToggleComplete} onEdit={mockEdit} onDelete={mockDelete} />)

    fireEvent.click(screen.getByText("Edit"))
    expect(mockEdit).toHaveBeenCalledWith(mockTask)
  })

  it("calls onDelete when delete button is clicked", () => {
    render(<TaskItem task={mockTask} onToggleComplete={mockToggleComplete} onEdit={mockEdit} onDelete={mockDelete} />)

    fireEvent.click(screen.getByText("Delete"))
    expect(mockDelete).toHaveBeenCalledWith("1")
  })

  it("applies line-through style when task is completed", () => {
    render(
      <TaskItem
        task={{ ...mockTask, completed: true }}
        onToggleComplete={mockToggleComplete}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />,
    )

    expect(screen.getByText("Test Task").className).toContain("line-through")
  })
})

