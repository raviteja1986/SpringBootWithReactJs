import axios from 'axios'
import type { Employee, EmployeeInput } from '../types/employee.types'

const API_URL = 'http://localhost:8080/api/employees'

export const employeeApi = {
  list: async (): Promise<Employee[]> => (await axios.get<Employee[]>(API_URL)).data,
  get: async (id: string | number): Promise<Employee> => (await axios.get<Employee>(`${API_URL}/${id}`)).data,
  create: async (employee: EmployeeInput): Promise<Employee> => (await axios.post<Employee>(API_URL, employee)).data,
  update: async (id: string | number, employee: EmployeeInput): Promise<Employee> => (await axios.put<Employee>(`${API_URL}/${id}`, employee)).data,
  remove: async (id: number): Promise<void> => { await axios.delete(`${API_URL}/${id}`) },
}
