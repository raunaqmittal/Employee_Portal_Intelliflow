import { TeamOverview } from '@/components/manager/TeamOverview'
import { ProjectStats } from '@/components/manager/ProjectStats'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus, Users, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManagerDashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your team performance, project progress, and workflow management in Product Design & Prototyping.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/manager/team">
          <Button className="group">
            <Users className="w-4 h-4 mr-2" />
            Manage Team
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link to="/manager/projects">
          <Button variant="outline" className="group">
            <FolderOpen className="w-4 h-4 mr-2" />
            View Projects
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Button variant="outline" className="group">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Team Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Team Performance</h2>
            <Link to="/manager/team">
              <Button variant="ghost" size="sm" className="group">
                View Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <TeamOverview />
        </div>

        {/* Project Statistics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Project Overview</h2>
            <Link to="/manager/projects">
              <Button variant="ghost" size="sm" className="group">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <ProjectStats />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Recent Activity</h2>
        <div className="bg-gradient-card border border-border rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Activity Feed Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Track recent team activities, task completions, and project updates all in one place.
          </p>
        </div>
      </div>
    </div>
  )
}