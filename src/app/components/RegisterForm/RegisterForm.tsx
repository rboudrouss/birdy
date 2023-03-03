"use client";

import { fetchWrapper } from "@/helper/fetchwrapper";
import userService from "@/helper/userService";
import { MouseEvent, useState } from "react";
import styles from "./RegisterForm.module.css";

export default function RegisterForm(props: { url?: string }) {
  let [email, setEmail] = useState<string | undefined>(undefined);
  let [passw, setPassw] = useState<string | undefined>(undefined);
  let [bio, setBio] = useState<string | undefined>(undefined);
  let [username, setUsername] = useState<string | undefined>(undefined);

  let user = userService.getConnectedUser();

  const register = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (props.url)
      fetchWrapper.put(props.url, {
        email,
        password: passw,
        bio,
        username,
      });
    else {
      if (!(email && passw && username)) {
        alert("Please fill at least email, password and username");
        return;
      }

      await userService.register({
        email,
        password: passw,
        bio,
        username,
      });
    }
  };

  return (
    <main>
      <form action="">
        <p>Username</p>
        <input
          type="text"
          required
          onChange={(e) => setUsername(e.target.value)}
          defaultValue={(user && user.username) ?? ""}
        />
        <p>Email</p>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          defaultValue={(user && user.email) ?? ""}
        />
        <p>password</p>
        <input
          type="text"
          required
          onChange={(e) => setPassw(e.target.value)}
        />
        <p>Bio (facultatif)</p>
        <input
          type="text"
          onChange={(e) => setBio(e.target.value)}
          defaultValue={(user && user.bio) ?? ""}
        />
        <button type="submit" onClick={register}>
          register
        </button>
      </form>
    </main>
  );
}
