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
      <div className={styles.logo}></div>
      <div className={styles.navigation}>
        <a href="/" className={styles.link}>
          {/* <FontAwesomeIcon icon={faMap} className={styles.icon} /> */}
          <div className="textWrapper">
            <p>Home</p>
          </div>
        </a>
        <a href="/login" className={styles.link}>
          {/* <FontAwesomeIcon icon={faMap} className={styles.icon} /> */}
          <div className="textWrapper">
            <p>Login</p>
          </div>
        </a>
        <a href="/register" className={styles.link}>
          {/* <FontAwesomeIcon icon={faMap} className={styles.icon} /> */}
          <div className="textWrapper">
            <p>Register</p>
          </div>
        </a>
        <a href="/profile" className={styles.link}>
          {/* <FontAwesomeIcon icon={faMap} className={styles.icon} /> */}
          <div className="textWrapper">
            <p>Profile</p>
          </div>
        </a>
        <p>
          {loggedIn
            ? `Connected as ${userService.getConnectedUser()?.username}`
            : "Not Connected"}
        </p>
      </div>
    </header>
  );
}
