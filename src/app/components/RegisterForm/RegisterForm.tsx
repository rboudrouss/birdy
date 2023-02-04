"use client";

import userService from "@/helper/userService";
import { MouseEvent, useState } from "react";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  let [email, setEmail] = useState("");
  let [passw, setPassw] = useState("");
  let [bio, setBio] = useState("");
  let [username, setUsername] = useState("");

  const register = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let resp = await userService.register({
      email,
      password: passw,
      bio,
      username,
    });
  };

  return (
    <main>
      <form action="">
        <p>Username</p>
        <input
          type="text"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <p>Email</p>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>password</p>
        <input
          type="text"
          required
          onChange={(e) => setPassw(e.target.value)}
        />
        <p>Bio (facultatif)</p>
        <input type="text" onChange={(e) => setBio(e.target.value)} />
        <button type="submit" onClick={register}>
          register
        </button>
      </form>
    </main>
  );
}
