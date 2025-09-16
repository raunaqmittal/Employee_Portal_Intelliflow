import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Calendar } from 'lucide-react';
import { loadDepartments, loadRoles } from '@/utils/dataParser';
import type { Department, Role } from '@/types';
import { useUser } from '@/contexts/UserContext'; // Import the useUser hook

// Remove the employeeId prop
export function ProfileCard() {
  // Get the shared employee and loading state from the context
  const { employee, loading } = useUser();
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  // This effect fetches details ONLY when the shared employee data is ready
  useEffect(() => {
    async function fetchDetails() {
      if (employee) {
        const [departments, roles] = await Promise.all([
          loadDepartments(),
          loadRoles()
        ]);
        setDepartment(departments.find(d => d.department_id === employee.department_id) || null);
        setRole(roles.find(r => r.role_id === employee.role_id) || null);
      }
    }
    fetchDetails();
  }, [employee]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading Profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Employee not found</p>
        </CardContent>
      </Card>
    );
  }

  const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <StatusBadge status={employee.availability} variant="availability" className="text-xs" />
          </div>
        </div>
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
        <div className="pt-4 border-t border-border">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Product Design & Prototyping
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}