import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Mail, MapPin, Plus, Edit } from 'lucide-react'
import { loadEmployees, loadDepartments, loadRoles } from '@/utils/dataParser'
import type { Employee, Department, Role } from '@/types'

export default function TeamManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const teamStats = {
    total: employees.length,
    available: employees.filter(e => e.availability === 'Available').length,
    busy: employees.filter(e => e.availability === 'Busy').length,
    onLeave: employees.filter(e => e.availability === 'On Leave').length
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
        <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your team members, view their availability, and track their roles in Product Design & Prototyping.
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{teamStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-status-done">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-status-done" />
              <div>
                <div className="text-2xl font-bold text-foreground">{teamStats.available}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-status-progress">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-status-progress" />
              <div>
                <div className="text-2xl font-bold text-foreground">{teamStats.busy}</div>
                <div className="text-sm text-muted-foreground">Busy</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-status-todo">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-status-todo" />
              <div>
                <div className="text-2xl font-bold text-foreground">{teamStats.onLeave}</div>
                <div className="text-sm text-muted-foreground">On Leave</div>
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
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="group">
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const department = departments.find(d => d.department_id === employee.department_id)
          const role = roles.find(r => r.role_id === employee.role_id)
          const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase()
          
          return (
            <Card key={employee.employee_id} className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{role?.role_name}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{department?.department_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <StatusBadge 
                    status={employee.availability} 
                    variant="availability" 
                    className="text-xs" 
                  />
                  <Badge variant="secondary" className="text-xs">
                    ID: {employee.employee_id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Team Members Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding team members to your organization.'}
          </p>
        </div>
      )}
    </div>
  )
}