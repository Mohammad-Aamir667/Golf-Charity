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
    const { response,data } = await apiFetch("/subscriptions/activate", {
      method: "POST",
      body: JSON.stringify({
        planType, // 🔥 dynamic now
      }),
    });
    console.log(data)
  
    if (response.ok) {
      alert(`Subscription (${planType}) activated`);
      setSubscription(data.subscription)
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
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome, {user?.name}</p>
        </div>

        {/* 🔥 Subscription Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Subscription</h3>

          <div className="space-y-3 mb-6">
            <p className="text-gray-700"><span className="font-medium">Status:</span> <span className="text-indigo-600 font-semibold">{subscription?.status || "inactive"}</span></p>
            <p className="text-gray-700"><span className="font-medium">Plan:</span> {subscription?.planType || "-"}</p>

            {subscription?.endDate && (
              <p className="text-gray-700">
                <span className="font-medium">Valid till:</span> {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {subscription?.status !== "active" && (
            <div className="space-y-4">
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <button 
                onClick={activateSubscription}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Activate Subscription
              </button>
            </div>
          )}
        </section>

        {/* 🔥 Add Score */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Add Score</h3>
          <div className="space-y-4">
            <input
              placeholder="Score"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={addScore}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Add
            </button>
          </div>
        </section>

        {/* 🔥 Score List */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your Scores</h3>

          {scores.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No scores yet</p>
          ) : (
            <div className="space-y-2">
              {scores.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="font-semibold text-gray-900">{s.value}</span>
                  <span className="text-gray-600">{new Date(s.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <button 
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default DashboardPage;
