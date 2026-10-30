export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type EmployeeInput = Omit<Employee, 'id'>
export type EmployeeFormMode = 'create' | 'update'
