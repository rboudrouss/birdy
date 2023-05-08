"use client";

import userService from "@/helper/userService";

import styles from "./LoginForm.module.css";

import { useState } from "react";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";

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
        <CustomInput
          label="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          type={"email"}
        />

        <CustomInput
          label="Password"
          id="password"
          onChange={(e) => setPassw(e.target.value)}
          required={true}
          type={"password"}
        />

        <CustomButton
          label="Login"
          onClick={login}
          type={"submit"}
        />
        {/* <button type="submit" onClick={login}>
          Login
        </button> */}
      </div>
    </form>
  );
}
