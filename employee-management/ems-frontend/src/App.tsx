import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeRoutes } from "./features/employees/employeeRoutes";
import { HeaderComponent } from "./components/HeaderComponent";
import { FooterComponent } from "./components/FooterComponent";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-shell">
          <HeaderComponent />
          <main className="main-content">
            <EmployeeRoutes />
          </main>
          <FooterComponent />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
