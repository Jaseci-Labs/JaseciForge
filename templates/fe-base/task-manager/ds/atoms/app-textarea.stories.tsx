import type { Meta, StoryObj } from "@storybook/react"
import { AppTextarea } from "./app-textarea"

const meta: Meta<typeof AppTextarea> = {
  title: "Atoms/AppTextarea",
  component: AppTextarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof AppTextarea>

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
    rows: 4,
  },
}

export const WithValue: Story = {
  args: {
    value: "This is a textarea with some content.\nIt can span multiple lines.",
    rows: 4,
    readOnly: true,
  },
}

export const WithError: Story = {
  args: {
    placeholder: "Type your message here...",
    rows: 4,
    error: true,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    rows: 4,
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    placeholder: "Full width textarea",
    rows: 4,
    fullWidth: true,
  },
}

