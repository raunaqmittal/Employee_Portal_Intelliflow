import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Users, UserCheck, UserX, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { loadEmployees, loadDepartments, loadRoles } from '@/utils/dataParser'
import type { Employee, Department, Role } from '@/types'

export function TeamOverview() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [employeesData, departmentsData, rolesData] = await Promise.all([
          loadEmployees(),
          loadDepartments(),
          loadRoles()
        ])
        setEmployees(employeesData)
        setDepartments(departmentsData)
        setRoles(rolesData)
      } catch (error) {
        console.error('Error fetching team data:', error)
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
          <p className="text-muted-foreground">Loading team overview...</p>
        </CardContent>
      </Card>
    )
  }

  const teamStats = {
    total: employees.length,
    available: employees.filter(e => e.availability === 'Available').length,
    busy: employees.filter(e => e.availability === 'Busy').length,
    onLeave: employees.filter(e => e.availability === 'On Leave').length
  }

  const statsData = [
    {
      label: 'Total Team',
      value: teamStats.total,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      label: 'Available',
      value: teamStats.available,
      icon: UserCheck,
      color: 'text-available',
      bgColor: 'bg-status-done-bg',
      borderColor: 'border-status-done-border'
    },
    {
      label: 'Busy',
      value: teamStats.busy,
      icon: Clock,
      color: 'text-busy',
      bgColor: 'bg-status-progress-bg',
      borderColor: 'border-status-progress-border'
    },
    {
      label: 'On Leave',
      value: teamStats.onLeave,
      icon: UserX,
      color: 'text-leave',
      bgColor: 'bg-status-todo-bg',
      borderColor: 'border-status-todo-border'
    }
  ]

  // Get recent team members (limit to 5)
  const recentTeamMembers = employees.slice(0, 5)

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Team Overview</CardTitle>
          <Badge variant="outline" className="bg-gradient-status">
            {teamStats.total} Team Members
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Team Stats Grid */}
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

        {/* Recent Team Members */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Team Members</h3>
          </div>
          
          <div className="space-y-3">
            {recentTeamMembers.map((employee) => {
              const department = departments.find(d => d.department_id === employee.department_id)
              const role = roles.find(r => r.role_id === employee.role_id)
              const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase()
              
              return (
                <div key={employee.employee_id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {role?.role_name} • {department?.department_name}
                    </p>
                  </div>
                  <StatusBadge 
                    status={employee.availability} 
                    variant="availability" 
                    className="text-xs flex-shrink-0" 
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}