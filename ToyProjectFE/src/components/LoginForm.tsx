import React, { useState } from "react";
import { login } from "../api/auth"; // 로그인 API 호출 함수
import axios from "axios";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await login(email, password);
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message || "Login failed.");
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      alert(errorMessage);
    }
  };
  return (
    <form
      onSubmit={handleLogin}
      className="login-input-box"
      style={{
        position: "absolute", // 부모 기준으로 위치 지정
        top: "100px",
        left: "70px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <input
        type="text"
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="login-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="social-login-button"
        style={{ backgroundColor: "#329632", marginTop: "20px" }}
        type="submit"
      >
        <span
          className="kakao-text"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            color: "white",
          }}
        >
          Sign in
        </span>
      </button>
    </form>
  );
};
