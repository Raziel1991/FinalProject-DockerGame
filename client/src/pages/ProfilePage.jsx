import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { clearMatchHistory, getProfileData, resetGameProgress } from "../graphql/gameApi";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  async function loadProfile() {
    const data = await getProfileData();
    setProfileData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleResetProgress() {
    const profile = await resetGameProgress();
    setActionMessage(profile ? "Progress reset through GraphQL." : "Progress reset failed.");
    await loadProfile();
  }

  async function handleClearHistory() {
    const cleared = await clearMatchHistory();
    setActionMessage(cleared ? "Match history cleared through GraphQL." : "Could not clear match history.");
  }

  return (
    <PageLayout
      title="Profile"
      description="Authenticated player profile backed by GraphQL."
    >
      {isLoading ? (
        <section className="panel">
          <p className="todo-note">Loading profile...</p>
        </section>
      ) : (
        <>
          <section className="card-grid">
            <article className="panel">
              <h2>Identity</h2>
              <p>Username: {profileData?.user?.username || "-"}</p>
              <p>Email: {profileData?.user?.email || "-"}</p>
              <p>Role: {profileData?.user?.role || "-"}</p>
            </article>

            <article className="panel">
              <h2>Progress</h2>
              <p>Level: {profileData?.profile?.level ?? 0}</p>
              <p>XP: {profileData?.profile?.xp ?? 0}</p>
              <p>Credits: {profileData?.profile?.credits ?? 0}</p>
              <p>Total Score: {profileData?.profile?.totalScore ?? 0}</p>
              <p>Current Stage: {profileData?.profile?.currentStage || "-"}</p>
            </article>
          </section>

          <section className="panel">
            <h2>Rewards</h2>
            {profileData?.profile?.unlockedCosmetics?.length ? (
              <div className="reward-list">
                {profileData.profile.unlockedCosmetics.map((cosmetic) => (
                  <span className="reward-chip" key={cosmetic}>
                    {cosmetic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="todo-note">No cosmetics unlocked yet. Complete an AI challenge to earn one.</p>
            )}
          </section>

          <section className="panel">
            <h2>Achievements</h2>
            {profileData?.achievements?.length ? (
              <ul>
                {profileData.achievements.map((achievement) => (
                  <li key={achievement.id}>
                    {achievement.title} - {achievement.completed ? "Unlocked" : "Locked"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="todo-note">No achievements yet.</p>
            )}
          </section>

          <section className="panel">
            <h2>Progress Management</h2>
            <div className="button-row">
              <button type="button" className="button button-secondary" onClick={handleClearHistory}>
                Clear Match History
              </button>
              <button type="button" className="button button-secondary" onClick={handleResetProgress}>
                Reset Progress
              </button>
            </div>
            {actionMessage ? <p className="todo-note">{actionMessage}</p> : null}
          </section>
        </>
      )}
    </PageLayout>
  );
}

export default ProfilePage;
