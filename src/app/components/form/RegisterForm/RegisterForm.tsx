"use client";

import { fetchWrapper } from "@/helper/fetchwrapper";
import userService from "@/helper/userService";
import { MouseEvent, useState } from "react";
import CustomButton from "../CustomButton/CustomButton";
import CustomInput from "../CustomInput/CustomInput";
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
      <form action="">
        <div className={styles.wrapper}>
        <CustomInput
          label="Username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required={true}
          type={"text"}
          defaultValue={user?.username}
        />
        <CustomInput
          label="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          type={"email"}
          defaultValue={user?.email}
        />
        <CustomInput
          label="Password"
          id="password"
          onChange={(e) => setPassw(e.target.value)}
          required={true}
          type={"password"}
        />
        <CustomInput
          label="Bio"
          id="bio"
          onChange={(e) => setBio(e.target.value)}
          required={false}
          type={"text"}
          defaultValue={user?.bio}
        />
        <CustomButton
          label="Register"
          onClick={register}
          type={"submit"}
        />
        </div>
      </form>
  );
}
