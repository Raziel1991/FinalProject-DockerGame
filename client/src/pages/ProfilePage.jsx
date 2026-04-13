import PageLayout from "../components/PageLayout";

function ProfilePage() {
  return (
    <PageLayout
      title="Profile"
      description="Starter profile page for the authenticated player."
    >
      <section className="card-grid">
        <article className="panel">
          <h2>Identity</h2>
          <p>Username: dockerCadet</p>
          <p>Email: dockerCadet@example.com</p>
          <p>Role: Player</p>
        </article>

        <article className="panel">
          <h2>Progress</h2>
          <p>Level: 3</p>
          <p>XP: 420</p>
          <p>Unlocked Cosmetics: 2</p>
        </article>
      </section>

      <section className="panel">
        <p className="todo-note">
          TODO: replace placeholder data with the authenticated user's profile and
          achievement progress from GraphQL.
        </p>
      </section>
    </PageLayout>
  );
}

export default ProfilePage;
