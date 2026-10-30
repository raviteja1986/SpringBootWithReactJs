import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  Employee,
  EmployeeFormMode,
  EmployeeInput,
} from "../types/employee.types";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});


type Values = z.infer<typeof schema>;

interface Props {
  mode: EmployeeFormMode;
  employee?: Employee;
  isSaving: boolean;
  onSubmit: (values: EmployeeInput) => void;
  error?: string;
}

export function EmployeeForm({
  mode,
  employee,
  isSaving,
  onSubmit,
  error,
}: Props) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });


  useEffect(() => {
    if (employee)
      reset({
        firstName: employee.firstName ?? "",
        lastName: employee.lastName ?? "",
        email: employee.email ?? "",
      });
  }, [employee, reset]);

  
  return (
    <Card className="form-card">
      <CardHeader>
        <div className="eyebrow">EMPLOYEE DIRECTORY</div>
        <CardTitle>
          {mode === "create" ? "Add an employee" : "Update employee"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Create a profile and add them to your team."
            : "Edit this employee’s contact information."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="employee-form"
        >
          <label className="field">
            <span>First name</span>
            <Input
              placeholder="e.g. Jordan"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName && (
              <small className="field-error">{errors.firstName.message}</small>
            )}
          </label>

          <label className="field">
            <span>Last name</span>
            <Input
              placeholder="e.g. Lee"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName && (
              <small className="field-error">{errors.lastName.message}</small>
            )}
          </label>

          <label className="field">
            <span>Work email</span>
            <Input
              type="email"
              placeholder="jordan@company.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <small className="field-error">{errors.email.message}</small>
            )}
          </label>

          {error && (
            <p className="alert-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving…"
                : mode === "create"
                  ? "Create employee"
                  : "Save changes"}
            </Button>

          </div>


        </form>
      </CardContent>
    </Card>
  );
}
