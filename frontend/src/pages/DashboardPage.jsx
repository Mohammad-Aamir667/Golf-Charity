import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../lib/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [planType, setPlanType] = useState("monthly");
  const [subscription, setSubscription] = useState(null);
  const [scores, setScores] = useState([]);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  // 🔹 Load subscription
  // const loadSubscription = async () => {
  //   const { response, data } = await apiFetch("/subscription");

  //   if (response.ok) {
  //     setSubscription(data);
  //   }
  // };

  // 🔹 Load scores
  const loadScores = async () => {
    const { response, data } = await apiFetch("/scores");

    if (response.ok) {
      setScores(data.scores || []);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    loadScores();
  //  loadSubscription();
  }, []);

  // 🔹 Activate subscription
  const activateSubscription = async () => {
    const { response } = await apiFetch("/subscriptions/activate", {
      method: "POST",
      body: JSON.stringify({
        planType, // 🔥 dynamic now
      }),
    });
  
    if (response.ok) {
      alert(`Subscription (${planType}) activated`);
     // loadSubscription(); // 🔥 refresh UI
    }
  };

  // 🔹 Add score
  const addScore = async () => {
    const numericValue = Number(value);

    if (!numericValue || numericValue < 1 || numericValue > 45) {
      alert("Enter valid score (1-45)");
      return;
    }

    if (!date) {
      alert("Select date");
      return;
    }

    // 🔒 Restrict if not subscribed
    if (subscription?.status !== "active") {
      alert("Please activate subscription first");
      return;
    }

    await apiFetch("/scores", {
      method: "POST",
      body: JSON.stringify({
        value: numericValue,
        date,
      }),
    });

    setValue("");
    setDate("");

    loadScores();
  };

  // 🔹 Logout
  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="container">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {/* 🔥 Subscription Section */}
      <section className="card">
  <h3>Subscription</h3>

  <p>Status: {subscription?.status || "inactive"}</p>
  <p>Plan: {subscription?.planType || "-"}</p>

  {subscription?.endDate && (
    <p>
      Valid till: {new Date(subscription.endDate).toLocaleDateString()}
    </p>
  )}

  {subscription?.status !== "active" && (
    <>
      <select
        value={planType}
        onChange={(e) => setPlanType(e.target.value)}
      >
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <button onClick={activateSubscription}>
        Activate Subscription
      </button>
    </>
  )}
</section>

      {/* 🔥 Add Score */}
      <section className="card">
        <h3>Add Score</h3>
        <input
          placeholder="Score"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addScore}>Add</button>
      </section>

      {/* 🔥 Score List */}
      <section className="card">
        <h3>Your Scores</h3>

        {scores.length === 0 ? (
          <p>No scores yet</p>
        ) : (
          scores.map((s, i) => (
            <p key={i}>
              {s.value} -{" "}
              {new Date(s.date).toLocaleDateString()}
            </p>
          ))
        )}
      </section>

      <button onClick={onLogout}>Logout</button>
    </main>
  );
};

export default DashboardPage;