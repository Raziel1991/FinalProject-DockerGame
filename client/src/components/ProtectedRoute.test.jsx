import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

function renderProtectedRoute(initialPath = "/dashboard", token = "") {
  if (token) {
    window.localStorage.setItem("token", token);
  } else {
    window.localStorage.removeItem("token");
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("ProtectedRoute", () => {
  test("redirects unauthenticated users to login", () => {
    renderProtectedRoute("/dashboard");

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders protected content for authenticated users", () => {
    renderProtectedRoute("/dashboard", "demo-token");

    expect(screen.getByText("Protected Dashboard")).toBeInTheDocument();
  });
});
