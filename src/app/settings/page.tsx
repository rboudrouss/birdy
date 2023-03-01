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
  let [submitting, setSubmitting] = useState(false);

  let submit = async (e: any) => {
    e.preventDefault();
    if (submitting) return;
    if (!file) return;

    setSubmitting(true)
    let resp = await ImageHelper.postBlob(
      file,
      `/api/user/${userService.userId}/pp`
    );
    setSubmitting(false)
    if (resp.ok) {
      alert("Profile picture changed!");
      window.location.href = "/";
    } else {
      try {
        await resp
          .json()
          .then((d) => {
            if (d.message) alert(d.message);
            console.error(d);
          })
          .catch(async () => {
            console.error(await resp.text().catch(() => "binary data"));
          });
      } catch {}
    }
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
      {submitting && <p>Submitting...</p>}
    </form>
  );
}

function ChangeProfile() {
  return <RegisterForm url={`/api/user/${userService.userId}`} />;
}
