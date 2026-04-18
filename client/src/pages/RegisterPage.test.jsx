import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./RegisterPage";
import { registerUser } from "../graphql/authApi";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../graphql/authApi", () => ({
  registerUser: vi.fn()
}));

function renderRegisterPage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("RegisterPage", () => {
  test("renders name email and password fields", () => {
    renderRegisterPage();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  test("renders register button", () => {
    renderRegisterPage();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("updates input values", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/username/i), "dockerCadet");
    await user.type(screen.getByLabelText(/^email$/i), "student@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    expect(screen.getByLabelText(/username/i)).toHaveValue("dockerCadet");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("student@example.com");
    expect(screen.getByLabelText(/^password$/i)).toHaveValue("Password123!");
    expect(screen.getByLabelText(/confirm password/i)).toHaveValue("Password123!");
  });

  test("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("All fields are required.");
    expect(registerUser).not.toHaveBeenCalled();
  });

  test("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/username/i), "dockerCadet");
    await user.type(screen.getByLabelText(/^email$/i), "not-an-email");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter a valid email address."
    );
  });

  test("shows password confirmation mismatch", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/username/i), "dockerCadet");
    await user.type(screen.getByLabelText(/^email$/i), "student@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Mismatch123!");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");
  });

  test("handles successful registration mock response", async () => {
    const user = userEvent.setup();
    registerUser.mockResolvedValue({
      token: "register-token",
      user: {
        username: "dockerCadet"
      }
    });

    renderRegisterPage();

    await user.type(screen.getByLabelText(/username/i), "dockerCadet");
    await user.type(screen.getByLabelText(/^email$/i), "student@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
    expect(window.localStorage.getItem("token")).toBe("register-token");
  });

  test("handles failed registration mock response", async () => {
    const user = userEvent.setup();
    registerUser.mockRejectedValue(new Error("Registration failed"));

    renderRegisterPage();

    await user.type(screen.getByLabelText(/username/i), "dockerCadet");
    await user.type(screen.getByLabelText(/^email$/i), "student@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        username: "dockerCadet",
        email: "student@example.com",
        password: "Password123!"
      });
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Registration failed. Please try again."
    );
  });
});
