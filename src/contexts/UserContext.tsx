import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getEmployeeById } from '@/utils/dataParser';
import type { Employee } from '@/types';

// For demo purposes, using a single employee ID
const CURRENT_EMPLOYEE_ID = 1;

// --- TEMPORARY FALLBACK DATA ---
// This object is used if getEmployeeById fails to load data.
// It ensures the application UI doesn't break during development.
const fallbackEmployee: Employee = {
  employee_id: 1,
  name: "Neha Saxena (Sample)",
  email: "neha.saxena.sample@example.com",
  department_id: 1,
  role_id: 1,
  availability: 'Available',
};

interface UserContextType {
  employee: Employee | null;
  loading: boolean;
  updateEmployee: (updatedInfo: Partial<Employee>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        let emp = await getEmployeeById(CURRENT_EMPLOYEE_ID);

        // --- DEBUGGING & FALLBACK LOGIC ---
        console.log("Fetched employee data:", emp); // Check your browser console for this log

        if (!emp) {
          console.warn("Could not find employee. Using fallback data for development.");
          emp = fallbackEmployee; // Use the fallback if the fetch returns null
        }
        
        setEmployee(emp);

      } catch (error) {
        console.error("Failed to fetch employee data:", error);
        console.warn("Using fallback data due to an error.");
        setEmployee(fallbackEmployee); // Also use fallback in case of an error
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const updateEmployee = (updatedInfo: Partial<Employee>) => {
    if (employee) {
      setEmployee(prevEmployee => ({ ...prevEmployee!, ...updatedInfo }));
    }
  };

  return (
    <UserContext.Provider value={{ employee, loading, updateEmployee }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}