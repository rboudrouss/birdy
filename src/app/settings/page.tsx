"use client";

import ImageHelper from "@/helper/ImageHelper";
import userService from "@/helper/userService";
import { useState } from "react";
import { Dropdown } from "../components/Dropdown/Dropdown";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import styles from "./page.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Here you can change your settings.</p>
      </div>

      <h2>Account</h2>
      <Dropdown label="Change profile picture">
        <div className={styles.profilePicture}>
          <ChangePP />
        </div>
      </Dropdown>

      <Dropdown label="Change profile or password">
        <ChangeProfile />
      </Dropdown>

      {/* <Dropdown label="Delete account">
        <h2>TODO</h2>
      </Dropdown> */}
    </div>
  );
}

function ChangePP() {
  let [file, setFile] = useState<File | null>(null);

  let submit = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    await ImageHelper.postBlob(file, `/api/user/${userService.userId}/pp`);
  };

  return (
    <form onSubmit={submit}>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(e) => setFile(e.target.files && e.target.files[0])}
      />
      <button onClick={submit}>Submit</button>
    </form>
  );
}

function ChangeProfile() {
  return <RegisterForm url={`/api/user/${userService.userId}`} />;
}
