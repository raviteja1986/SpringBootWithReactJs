import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { employeeApi } from "../services/employeeApi";
import type { EmployeeInput } from "../types/employee.types";
import { EmployeeForm } from "../components/EmployeeForm";

export function CreateEmployeePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: EmployeeInput) => employeeApi.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees");
    },
  });
  
  return (
    <section className="page narrow-page">
      <EmployeeForm
        mode="create"
        isSaving={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data)}
        error={
          mutation.isError
            ? "Could not create the employee. Please try again."
            : undefined
        }
      />
    </section>
  );
}
