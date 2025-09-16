export interface Department {
  department_id: number;
  department_name: string;
}

export interface Role {
  role_id: number;
  role_name: string;
  department_id: number;
}

export interface Employee {
  employee_id: number;
  name: string;
  email: string;
  role_id: number;
  department_id: number;
  availability: 'Available' | 'Busy' | 'On Leave';
}

export interface Project {
  project_id: number;
  client_name: string;
  project_title: string;
  category: string;
  framework: 'Agile' | 'Waterfall' | 'Hybrid';
  status: 'In Progress' | 'Completed' | 'Pending' | 'Cancelled';
}

export interface Sprint {
  sprint_id: number;
  project_id: number;
  sprint_name: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface Task {
  task_id: number;
  sprint_id: number;
  task_name: string;
  department_id: number;
  role_id: number;
  assigned_to: number;
  status: 'Done' | 'In Progress' | 'Pending';
}

export interface TaskWithDetails extends Task {
  employee_name: string;
  department_name: string;
  role_name: string;
  project_title: string;
  sprint_name: string;
}

export type TaskStatus = 'Done' | 'In Progress' | 'Pending';
export type AvailabilityStatus = 'Available' | 'Busy' | 'On Leave';