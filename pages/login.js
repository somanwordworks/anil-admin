import { useState } from "react";
import Router from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // NEW

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // NEW

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false); // NEW

    if (data.ok) {
      localStorage.setItem("admin_token", data.token);
      Router.push("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f2f2f2",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          type="submit"
          disabled={loading} // NEW
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#ff7a00", // NEW
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer", // NEW
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <>
              <span
                className="animate-spin"
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              ></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
