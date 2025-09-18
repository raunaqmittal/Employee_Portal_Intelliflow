import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { FolderOpen, Search, Calendar, User, Plus, Edit, Eye } from 'lucide-react'
import { loadProjects, loadTasks, loadEmployees, loadSprints } from '@/utils/dataParser'
import type { Project, Task, Employee, Sprint } from '@/types'

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, tasksData, employeesData, sprintsData] = await Promise.all([
          loadProjects(),
          loadTasks(),
          loadEmployees(),
          loadSprints()
        ])
        setProjects(projectsData)
        setTasks(tasksData)
        setEmployees(employeesData)
        setSprints(sprintsData)
      } catch (error) {
        console.error('Error fetching project data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = projects.filter(project =>
    project.project_title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProjectProgress = (projectId: number) => {
    // Note: Tasks are linked to projects through sprints, so we need to find sprints first
    const projectSprints = sprints.filter(sprint => sprint.project_id === projectId)
    const sprintIds = projectSprints.map(sprint => sprint.sprint_id)
    const projectTasks = tasks.filter(task => sprintIds.includes(task.sprint_id))
    if (projectTasks.length === 0) return 0
    const completedTasks = projectTasks.filter(task => task.status === 'Done').length
    return Math.round((completedTasks / projectTasks.length) * 100)
  }

  // Note: Manager info is not available in current Project schema
  const getProjectManager = () => {
    return null // Will be updated when manager_id is added to Project schema
  }

  const projectStats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    pending: projects.filter(p => p.status === 'Pending').length
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
        <p className="text-muted-foreground">
          Manage all your Product Design & Prototyping projects, track progress, and oversee team assignments.
        </p>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{projectStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-status-progress">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-8 h-8 text-status-progress" />
              <div>
                <div className="text-2xl font-bold text-foreground">{projectStats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-status-done">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-8 h-8 text-status-done" />
              <div>
                <div className="text-2xl font-bold text-foreground">{projectStats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-status-todo">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-8 h-8 text-status-todo" />
              <div>
                <div className="text-2xl font-bold text-foreground">{projectStats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="group">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProjects.map((project) => {
          const manager = getProjectManager()
          const progress = getProjectProgress(project.project_id)
          const projectSprints = sprints.filter(sprint => sprint.project_id === project.project_id)
          const sprintIds = projectSprints.map(sprint => sprint.sprint_id)
          const projectTaskCount = tasks.filter(task => sprintIds.includes(task.sprint_id)).length
          
          return (
            <Card key={project.project_id} className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.project_title}</CardTitle>
                    <Badge 
                      variant={project.status === 'Completed' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Project Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Category: {project.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Client: {project.client_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Framework: {project.framework}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Progress</span>
                    <span className="text-sm font-bold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {projectTaskCount} tasks total
                  </p>
                </div>

                {/* Project Category */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Category: {project.category}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Projects Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first project.'}
          </p>
        </div>
      )}
    </div>
  )
}