import { useState, useEffect } from 'react'
import { ProfileCard } from '@/components/dashboard/ProfileCard'
import { TaskSummary } from '@/components/dashboard/TaskSummary'
import { TaskCard } from '@/components/tasks/TaskCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTasksForEmployee } from '@/utils/dataParser'
import type { TaskWithDetails, TaskStatus } from '@/types'
import { useUser } from '@/contexts/UserContext' // Import useUser to access employee ID

export default function Dashboard() {
  const { employee } = useUser(); // Get the globally managed employee
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      // Ensure employee exists before fetching their tasks
      if (!employee) {
        setLoading(false);
        return;
      }
      try {
        const employeeTasks = await getTasksForEmployee(employee.employee_id)
        setTasks(employeeTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [employee]) // Re-fetch tasks if the employee context changes

  const handleTaskStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.task_id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  // Get recent tasks (limit to 3 for dashboard view)
  const recentTasks = tasks.slice(0, 3)

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg-col-span-1">
            <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
          </div>
          <div className="lg-col-span-2">
            <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your tasks, track progress, and stay productive in your Product Design & Prototyping workflow.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card is now self-sufficient via context */}
        <div className="lg:col-span-1">
          <Link to="/profile" className="focus-ring rounded-lg block">
            <ProfileCard />
          </Link>
        </div>

        {/* Right Column - Task Overview */}
        <div className="lg:col-span-2">
          <TaskSummary tasks={tasks} />
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Recent Tasks</h2>
          <Link to="/tasks">
            <Button variant="outline" className="group">
              View All Tasks
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                className="animate-slide-up"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Tasks Assigned</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don't have any tasks assigned yet. Check back later or contact your project manager.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}