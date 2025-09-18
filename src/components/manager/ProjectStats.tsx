import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FolderOpen, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { loadProjects, loadTasks } from '@/utils/dataParser'
import type { Project, Task } from '@/types'

export function ProjectStats() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, tasksData] = await Promise.all([
          loadProjects(),
          loadTasks()
        ])
        setProjects(projectsData)
        setTasks(tasksData)
      } catch (error) {
        console.error('Error fetching project data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading project statistics...</p>
        </CardContent>
      </Card>
    )
  }

  const projectStats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    pending: projects.filter(p => p.status === 'Pending').length
  }

  const taskStats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length
  }

  const overallProgress = taskStats.total > 0 
    ? Math.round((taskStats.done / taskStats.total) * 100) 
    : 0

  const statsData = [
    {
      label: 'Active Projects',
      value: projectStats.inProgress,
      icon: FolderOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      label: 'Completed',
      value: projectStats.completed,
      icon: CheckCircle,
      color: 'text-status-done',
      bgColor: 'bg-status-done-bg',
      borderColor: 'border-status-done-border'
    },
    {
      label: 'Pending',
      value: projectStats.pending,
      icon: Calendar,
      color: 'text-status-todo',
      bgColor: 'bg-status-todo-bg',
      borderColor: 'border-status-todo-border'
    },
    {
      label: 'Total Tasks',
      value: taskStats.total,
      icon: AlertTriangle,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border'
    }
  ]

  // Get recent projects (limit to 3)
  const recentProjects = projects.slice(0, 3)

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Project Statistics</CardTitle>
          <Badge variant="outline" className="bg-gradient-status">
            {projectStats.total} Total Projects
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Project Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="flex items-center space-x-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Task Progress</span>
            <span className="text-lg font-bold text-status-done">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {taskStats.done} of {taskStats.total} tasks completed
          </p>
        </div>

        {/* Recent Projects */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Recent Projects</h3>
          </div>
          
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.project_id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {project.project_title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Framework: {project.framework}
                  </p>
                </div>
                <Badge 
                  variant={project.status === 'Completed' ? 'default' : 'secondary'}
                  className="ml-2 flex-shrink-0"
                >
                  {project.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}