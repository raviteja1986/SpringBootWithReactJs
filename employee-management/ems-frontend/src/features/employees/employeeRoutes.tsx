import { Navigate, Route, Routes } from "react-router-dom";
import { CreateEmployeePage } from "./pages/CreateEmployeePage";
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { UpdateEmployeePage } from "./pages/UpdateEmployeePage";
export function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeListPage />} />
      <Route path="/employees" element={<EmployeeListPage />} />
      <Route path="/add-employee" element={<CreateEmployeePage />} />
      <Route path="/edit-employee/:id" element={<UpdateEmployeePage />} />
      <Route path="*" element={<Navigate to="/employees" replace />} />
    </Routes>
  );
}
