import PageLayout from "../components/PageLayout";

function RegisterPage() {
  return (
    <PageLayout
      title="Register"
      description="Starter registration form for the Docker Heist player profile."
    >
      <section className="panel form-panel">
        <label>
          Username
          <input type="text" placeholder="dockerCadet" />
        </label>

        <label>
          Email
          <input type="email" placeholder="dockerCadet@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="Create password" />
        </label>

        <button type="button" className="button">
          Register
        </button>

        <p className="todo-note">
          TODO: connect this form to the GraphQL register mutation and initialize
          the player game profile.
        </p>
      </section>
    </PageLayout>
  );
}

export default RegisterPage;
