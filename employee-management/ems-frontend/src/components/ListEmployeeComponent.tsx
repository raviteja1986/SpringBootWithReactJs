
import { useEffect, useState } from "react";
import {
  deleteEmployee,
  listEmployees,
} from "../services/EmployeeService";
import { useNavigate } from "react-router-dom";

// Defines the structure of an employee
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const ListEmployeeComponent = () => {
  // Stores the employee list
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Stores the current page number
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Number of employees displayed per page
  const employeesPerPage: number = 5;

  // Calculate pagination values
  const totalPages = Math.ceil(
    employees.length / employeesPerPage
  );

  const firstEmployeeIndex =
    (currentPage - 1) * employeesPerPage;

  const currentEmployees = employees.slice(
    firstEmployeeIndex,
    firstEmployeeIndex + employeesPerPage
  );

  // Navigation hook
  const navigator = useNavigate();

  // Load employees when the component mounts
  useEffect(() => {
    getAllEmployees();
  }, []);

  // Fetch employees from the backend
  function getAllEmployees(): void {
    listEmployees()
      .then((response) => {
        const employeeData: Employee[] = response.data;

        setEmployees(employeeData);

        // Keep the current page within the valid range
        setCurrentPage((page) =>
          Math.min(
            page,
            Math.max(
              1,
              Math.ceil(employeeData.length / employeesPerPage)
            )
          )
        );
      })
      .catch((error: unknown) => {
        console.error("Error fetching employees:", error);
      });
  }

  // Navigate to employee registration
  function addNewEmployee(): void {
    navigator("/add-employee");
  }

  // Navigate to employee update page
  function updateEmployee(id: number): void {
    navigator(`/edit-employee/${id}`);
  }

  // Delete employee and refresh the list
  function removeEmployee(id: number): void {
    deleteEmployee(id)
      .then(() => {
        getAllEmployees();
      })
      .catch((error: unknown) => {
        console.error("Error deleting employee:", error);
      });
  }

  return (
    <div className="container">
      <h2 className="text-center">List of Employees</h2>

      <button
        className="btn btn-primary mb-2"
        onClick={addNewEmployee}
      >
        Add Employee
      </button>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Employee Id</th>
            <th>Employee First Name</th>
            <th>Employee Last Name</th>
            <th>Employee Email Id</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => updateEmployee(employee.id)}
                >
                  Update
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => removeEmployee(employee.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav aria-label="Employee list pages">
          <ul className="pagination justify-content-center">
            <li
              className={`page-item ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <li
                className={`page-item ${
                  currentPage === page ? "active" : ""
                }`}
                key={page}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ListEmployeeComponent;
