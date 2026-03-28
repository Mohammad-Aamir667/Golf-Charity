import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../lib/api";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [draws, setDraws] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Label helper (FIX 1)
  const getLabel = (count) => {
    if (count === 5) return "🏆 Jackpot";
    if (count === 4) return "🥈 2nd Tier";
    if (count === 3) return "🥉 3rd Tier";
    return "";
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersResult, drawsResult] = await Promise.all([
        apiFetch("/admin/users"),
        apiFetch("/admin/draw/results"),
      ]);

      if (usersResult.response.ok) {
        setUsers(usersResult.data.users || []);
      }

      if (drawsResult.response.ok) {
        setDraws(drawsResult.data.draws || []);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const runDraw = async () => {
    const { response, data } = await apiFetch("/admin/draw/run", {
      method: "POST",
    });

    if (!response.ok) {
      setMessage(data.message || "Failed to run draw");
      return;
    }

    setMessage("Draw executed successfully");
    await loadData();
  };

  const onLogout = async () => {
    await logout();
    navigate("/admin");
  };

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>

      {/* 🔹 Controls */}
      <section className="card">
        <div className="row">
          <button onClick={runDraw}>Run Draw</button>
          <button onClick={onLogout}>Logout</button>
        </div>

        {message && <p className="message">{message}</p>}

        <p>Total Users: {users.length}</p>
        <p>Total Draws: {draws.length}</p>

        {loading && <p>Loading...</p>}
      </section>

      {/* 🔥 DRAW RESULTS */}
      <section className="card">
        <h2>Draw Results</h2>

        {draws.length === 0 ? (
          <p>No draws yet</p>
        ) : (
          draws.map((draw, i) => (
            <div key={draw._id || i} style={{ marginBottom: 15 }}>
              
              <p>
                <strong>Date:</strong>{" "}
                {new Date(draw.drawDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Numbers:</strong>{" "}
                {draw.numbers?.join(", ") || "N/A"}
              </p>

              <p><strong>Winners:</strong></p>

              {!draw.winners || draw.winners.length === 0 ? (
                <p>No winners</p>
              ) : (
                draw.winners.map((w, idx) => (
                  <p key={idx}>
                    {w.userId?.name || "Unknown"} (
                    {w.userId?.email || "N/A"}) — Matches: {w.matchCount}{" "}
                    {getLabel(w.matchCount)}
                  </p>
                ))
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default AdminDashboardPage;