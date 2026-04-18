import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { loginUser } from "../graphql/authApi";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../graphql/authApi", () => ({
  loginUser: vi.fn()
}));

function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("LoginPage", () => {
  test("renders email and password inputs", () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("renders login button", () => {
    renderLoginPage();

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates input values", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.clear(emailInput);
    await user.type(emailInput, "student@example.com");
    await user.clear(passwordInput);
    await user.type(passwordInput, "Password123!");

    expect(emailInput).toHaveValue("student@example.com");
    expect(passwordInput).toHaveValue("Password123!");
  });

  test("shows validation error when fields are empty", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.clear(screen.getByLabelText(/email/i));
    await user.clear(screen.getByLabelText(/password/i));
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email and password are required.");
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("submits valid credentials", async () => {
    const user = userEvent.setup();
    loginUser.mockResolvedValue({
      token: "demo-token",
      user: {
        username: "dockerCadet"
      }
    });

    renderLoginPage();

    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "demo@dockerops.com");
    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), "Demo123!");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "demo@dockerops.com",
        password: "Demo123!"
      });
    });
  });

  test("handles invalid credentials mock response", async () => {
    const user = userEvent.setup();
    loginUser.mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage();

    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "wrong@dockerops.com");
    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), "Wrong123!");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
  });

  test("handles successful login mock response", async () => {
    const user = userEvent.setup();
    loginUser.mockResolvedValue({
      token: "demo-token",
      user: {
        username: "dockerCadet"
      }
    });

    renderLoginPage();

    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "demo@dockerops.com");
    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), "Demo123!");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
    expect(window.localStorage.getItem("token")).toBe("demo-token");
  });
});
