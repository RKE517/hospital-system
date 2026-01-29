"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 HANDLE LOGIN
  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "Nandytha" && password === "admin") {
      // ✅ SIMPAN STATUS LOGIN
      localStorage.setItem("isLoggedIn", "true");

      router.push("/dashboard");
    } else {
      alert("Username atau Password salah");
    }
  };


  return (
    <div className="login-page">
      {/* BACKGROUND */}
      <div className="bg-layer" />

      {/* HEADER */}
      <header className="header">
        <img src="/logo.png" alt="Logo" className="logo" />
      </header>

      {/* CONTENT */}
      <main className="content">
        {/* TITLE */}
        <div className="title-box">
          <h1>Hospital Management System</h1>
          <p>Please log in first to access the hospital data</p>
        </div>

        {/* LOGIN CARD */}
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </main>

      {/* STYLE */}
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          position: relative;
          font-family: Arial, sans-serif;
        }

        /* BACKGROUND IMAGE */
        .bg-layer {
          position: fixed;
          inset: 0;
          background: url("/bg-hospital.png") center / cover no-repeat;
          z-index: 0;
          pointer-events: none;
        }

        /* HEADER */
        .header {
          height: 70px;
          background: #405940;
          display: flex;
          align-items: center;
          padding-left: 24px;
          position: relative;
          z-index: 10;
        }

        .logo {
          height: 40px;
        }

        /* CONTENT */
        .content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 80px;
        }

        /* TITLE BOX */
        .title-box {
          background: #405940;
          color: white;
          padding: 20px 32px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 32px;
        }

        .title-box h1 {
          margin: 0;
          font-size: 22px;
        }

        .title-box p {
          margin-top: 6px;
          font-size: 13px;
        }

        /* LOGIN CARD */
        .login-card {
          background: white;
          width: 360px;
          padding: 24px;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .login-card h2 {
          margin-bottom: 10px;
        }

        .login-card input {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .login-card button {
          margin-top: 12px;
          background: #405940;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .login-card button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
