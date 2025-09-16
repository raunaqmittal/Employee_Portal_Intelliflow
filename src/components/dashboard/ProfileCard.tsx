import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Badge } from '@/components/ui/badge'
import { Mail, MapPin, Calendar } from 'lucide-react'
import { getEmployeeById, loadDepartments, loadRoles } from '@/utils/dataParser'
import type { Employee, Department, Role } from '@/types'

interface ProfileCardProps {
  employeeId: number
}

export function ProfileCard({ employeeId }: ProfileCardProps) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [department, setDepartment] = useState<Department | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [emp, departments, roles] = await Promise.all([
          getEmployeeById(employeeId),
          loadDepartments(),
          loadRoles()
        ])
        
        if (emp) {
          setEmployee(emp)
          setDepartment(departments.find(d => d.department_id === emp.department_id) || null)
          setRole(roles.find(r => r.role_id === emp.role_id) || null)
        }
      } catch (error) {
        console.error('Error fetching employee data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [employeeId])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Employee not found</p>
        </CardContent>
      </Card>
    )
  }

  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Profile Info */}
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-xl font-semibold text-foreground">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{role?.role_name || 'Unknown Role'}</p>
            </div>
            
            <StatusBadge 
              status={employee.availability} 
              variant="availability"
              className="text-xs"
            />
          </div>
        </div>

        {/* Contact & Department Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{employee.email}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{department?.department_name || 'Unknown Department'}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Employee ID: {employee.employee_id}</span>
          </div>
        </div>

        {/* Skills Badge */}
        <div className="pt-4 border-t border-border">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Product Design & Prototyping
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}