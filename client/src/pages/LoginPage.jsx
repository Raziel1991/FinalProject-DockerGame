import PageLayout from "../components/PageLayout";

function LoginPage() {
  return (
    <PageLayout
      title="Login"
      description="Frontend auth form stub. Connect this page to the GraphQL login mutation in Phase 2."
    >
      <section className="panel form-panel">
        <label>
          Email
          <input type="email" placeholder="captain@dockerheist.dev" />
        </label>

        <label>
          Password
          <input type="password" placeholder="Enter password" />
        </label>

        <button type="button" className="button">
          Login
        </button>

        <p className="todo-note">
          TODO: submit the login mutation, store the JWT, and redirect authenticated
          users to the dashboard.
        </p>
      </section>
    </PageLayout>
  );
}

export default LoginPage;
