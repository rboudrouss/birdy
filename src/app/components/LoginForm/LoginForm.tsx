"use client";

import userService from "@/helper/userService";

import styles from "./LoginForm.module.css";

import { useState } from "react";

export default function LoginForm() {
  let [email, setEmail] = useState("");
  let [passw, setPassw] = useState("");

  const login = async (e: any) => {
    e.preventDefault();
    await userService.login(email, passw);
  };

  return (
    <form onSubmit={login}>
      <div className={styles.wrapper}>
        <p>Email</p>
        <input
          type="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>password</p>
        <input
          type="password"
          required={true}
          onChange={(e) => setPassw(e.target.value)}
        />
        <button type="submit" onClick={login}>
          Login
        </button>
      </div>
    </form>
  );
}
