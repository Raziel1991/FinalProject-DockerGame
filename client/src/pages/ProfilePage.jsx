import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { getProfileData } from "../graphql/gameApi";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfileData();
      setProfileData(data);
      setIsLoading(false);
    }

    loadProfile();
  }, []);

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
              <p>Total Score: {profileData?.profile?.totalScore ?? 0}</p>
              <p>Current Stage: {profileData?.profile?.currentStage || "-"}</p>
            </article>
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
        </>
      )}
    </PageLayout>
  );
}

export default ProfilePage;
