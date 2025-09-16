import type { 
  Department, 
  Role, 
  Employee, 
  Project, 
  Sprint, 
  Task, 
  TaskWithDetails 
} from '@/types';

// CSV parsing utility
export function parseCSV<T>(csvText: string): T[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    
    headers.forEach((header, index) => {
      const key = header.trim();
      let value: any = values[index]?.trim() || '';
      
      // Convert numeric strings to numbers for ID fields
      if (key.includes('_id') || key === 'assigned_to') {
        value = parseInt(value, 10);
      }
      
      obj[key] = value;
    });
    
    return obj as T;
  });
}

// Data loading functions
export async function loadDepartments(): Promise<Department[]> {
  const response = await fetch('/src/data/departments.csv');
  const csvText = await response.text();
  return parseCSV<Department>(csvText);
}

export async function loadRoles(): Promise<Role[]> {
  const response = await fetch('/src/data/roles.csv');
  const csvText = await response.text();
  return parseCSV<Role>(csvText);
}

export async function loadEmployees(): Promise<Employee[]> {
  const response = await fetch('/src/data/employees.csv');
  const csvText = await response.text();
  return parseCSV<Employee>(csvText);
}

export async function loadProjects(): Promise<Project[]> {
  const response = await fetch('/src/data/projects.csv');
  const csvText = await response.text();
  return parseCSV<Project>(csvText);
}

export async function loadSprints(): Promise<Sprint[]> {
  const response = await fetch('/src/data/sprints.csv');
  const csvText = await response.text();
  return parseCSV<Sprint>(csvText);
}

export async function loadTasks(): Promise<Task[]> {
  const response = await fetch('/src/data/tasks.csv');
  const csvText = await response.text();
  return parseCSV<Task>(csvText);
}

// Enhanced data functions that join related data
export async function loadTasksWithDetails(): Promise<TaskWithDetails[]> {
  const [tasks, employees, departments, roles, projects, sprints] = await Promise.all([
    loadTasks(),
    loadEmployees(),
    loadDepartments(),
    loadRoles(),
    loadProjects(),
    loadSprints()
  ]);

  return tasks.map(task => {
    const employee = employees.find(emp => emp.employee_id === task.assigned_to);
    const department = departments.find(dept => dept.department_id === task.department_id);
    const role = roles.find(r => r.role_id === task.role_id);
    const sprint = sprints.find(s => s.sprint_id === task.sprint_id);
    const project = projects.find(p => {
      const sprintMatch = sprints.find(s => s.sprint_id === task.sprint_id);
      return sprintMatch && p.project_id === sprintMatch.project_id;
    });

    return {
      ...task,
      employee_name: employee?.name || 'Unknown',
      department_name: department?.department_name || 'Unknown',
      role_name: role?.role_name || 'Unknown',
      project_title: project?.project_title || 'Unknown',
      sprint_name: sprint?.sprint_name || 'Unknown'
    };
  });
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  const employees = await loadEmployees();
  return employees.find(emp => emp.employee_id === id) || null;
}

export async function getTasksForEmployee(employeeId: number): Promise<TaskWithDetails[]> {
  const tasksWithDetails = await loadTasksWithDetails();
  return tasksWithDetails.filter(task => task.assigned_to === employeeId);
}