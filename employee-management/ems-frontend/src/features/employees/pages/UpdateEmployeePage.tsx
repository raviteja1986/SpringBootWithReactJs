import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { employeeApi } from "../services/employeeApi";
import type { EmployeeInput } from "../types/employee.types";
import { EmployeeForm } from "../components/EmployeeForm";

export function UpdateEmployeePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const employee = useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeeApi.get(id),
    enabled: !!id,
  });


  const mutation = useMutation({
    mutationFn: (data: EmployeeInput) => employeeApi.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees");
    },
  });

  
  if (employee.isPending)
    return (
      <section className="page narrow-page">
        <div className="loading-card">Loading employee…</div>
      </section>
    );
  if (employee.isError || !employee.data)
    return (
      <section className="page narrow-page">
        <Card>
          <CardContent>
            <p className="alert-error">We couldn’t load this employee.</p>
            <Button variant="outline" onClick={() => navigate("/employees")}>
              Back to employees
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  return (
    <section className="page narrow-page">
      <EmployeeForm
        mode="update"
        employee={employee.data}
        isSaving={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
        error={
          mutation.isError
            ? "Could not save these changes. Please try again."
            : undefined
        }
      />
    </section>
  );
}
