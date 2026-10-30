import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { employeeApi } from "../services/employeeApi";
import type { Employee } from "../types/employee.types";


const PER_PAGE = 6;

export function EmployeeListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const employees = useQuery({
    queryKey: ["employees"],
    queryFn: employeeApi.list,
  });

  const deletion = useMutation({
    mutationFn: employeeApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
  
  const filtered = useMemo(
    () =>
      (employees.data ?? []).filter((employee: Employee) =>
        `${employee.firstName} ${employee.lastName} ${employee.email}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [employees.data, search],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }
  
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">PEOPLE OPERATIONS</div>
          <h1>Employees</h1>
          <p>Manage your team directory and employee details.</p>
        </div>
        <Button onClick={() => navigate("/add-employee")}>
          <span className="plus-icon">＋</span> Add employee
        </Button>
      </div>
      <Card className="table-card">
        <div className="table-toolbar">

          <div>
            <h2>All employees</h2>
            <p>{employees.data?.length ?? "—"} people in your organization</p>
          </div>

          <div className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search employees"
              placeholder="Search employees…"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
            />
          </div>

        </div>
        {employees.isPending ? (
          <div className="empty-state">Loading your employee directory…</div>
        ) : employees.isError ? (
          <div className="empty-state error-state">
            <p>We couldn’t load the employee directory.</p>
            <Button
              variant="outline"
              onClick={() =>
                void queryClient.invalidateQueries({ queryKey: ["employees"] })
              }
            >
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            {search
              ? "No employees match your search."
              : "No employees yet. Add your first team member to get started."}
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>EMAIL ADDRESS</th>
                    <th>EMPLOYEE ID</th>
                    <th className="actions-heading">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="person-cell">
                          <span className="avatar">
                            {employee.firstName.charAt(0)}
                            {employee.lastName.charAt(0)}
                          </span>
                          <span className="person-name">
                            {employee.firstName} {employee.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="muted-cell">{employee.email}</td>
                      <td>
                        <span className="id-pill">
                          EMP-{String(employee.id).padStart(4, "0")}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <Button
                          variant="ghost"
                          className="action-button"
                          aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                          onClick={() =>
                            navigate(`/edit-employee/${employee.id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="action-button delete-button"
                          disabled={deletion.isPending}
                          aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete ${employee.firstName} ${employee.lastName}?`,
                              )
                            )
                              deletion.mutate(employee.id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>
                Showing{" "}
                <strong>
                  {(page - 1) * PER_PAGE + 1}–
                  {Math.min(page * PER_PAGE, filtered.length)}
                </strong>{" "}
                of <strong>{filtered.length}</strong> employees
              </span>
              <div className="pagination">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
