import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { TaskStatus, AvailabilityStatus } from "@/types"

interface StatusBadgeProps {
  status: TaskStatus | AvailabilityStatus
  variant?: 'task' | 'availability'
  className?: string
}

const taskStatusStyles = {
  'Done': 'bg-status-done-bg text-status-done border-status-done-border',
  'In Progress': 'bg-status-progress-bg text-status-progress border-status-progress-border',
  'Pending': 'bg-status-todo-bg text-status-todo border-status-todo-border'
} as const

const availabilityStatusStyles = {
  'Available': 'bg-status-done-bg text-available border-status-done-border',
  'Busy': 'bg-status-progress-bg text-busy border-status-progress-border', 
  'On Leave': 'bg-status-todo-bg text-leave border-status-todo-border'
} as const

export function StatusBadge({ status, variant = 'task', className }: StatusBadgeProps) {
  const styles = variant === 'task' 
    ? taskStatusStyles[status as TaskStatus]
    : availabilityStatusStyles[status as AvailabilityStatus]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border transition-colors",
        styles,
        className
      )}
    >
      {status}
    </Badge>
  )
}