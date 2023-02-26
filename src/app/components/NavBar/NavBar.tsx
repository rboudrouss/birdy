"use client";

import styles from "./NavBar.module.css";
import cookieWrapper from "@/helper/cookiewrapper";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import userService from "@/helper/userService";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(cookieWrapper.front.isConnected());
  }, []);

  return (
    <header className={styles.header}>
      {/* <div className={styles.logo}></div> */}
      <div className={styles.navigation}>
        <a href="/" className={styles.link}>
          <div className="textWrapper">
            <p>Home</p>
          </div>
        </a>
        {!loggedIn && (
          <a href="/login" className={styles.link}>
            <div className="textWrapper">
              <p>Login</p>
            </div>
          </a>
        )}
        {!loggedIn && (
          <a href="/register" className={styles.link}>
            <div className="textWrapper">
              <p>Register</p>
            </div>
          </a>
        )}
        {loggedIn && (
          <a href={`/profile/${userService.userId}`} className={styles.link}>
            <div className="textWrapper">
              <p>Profile</p>
            </div>
          </a>
        )}
        {loggedIn && (
          <a href="/settings" className={styles.link}>
            <div className="textWrapper">
              <p>Settings</p>
            </div>
          </a>
        )}
        {loggedIn && (
          <a href="/logout" className={styles.link}>
            <div className="textWrapper">
              <p>Logout</p>
            </div>
          </a>
        )}
        <p>
          {loggedIn
            ? `Connected as ${userService.getConnectedUser()?.username}`
            : "Not Connected"}
        </p>
      </div>
    </header>
  );
}
