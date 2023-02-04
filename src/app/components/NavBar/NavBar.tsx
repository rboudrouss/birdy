"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./NavBar.module.css";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import cookieWrapper from "@/helper/cookiewrapper";
import Cookies from "js-cookie";

export default function NavBar() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>
      <div className={styles.navigation}>
        <a href="/" className={styles.link}>
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
          <div className="textWrapper">
            <p>Home</p>
          </div>
        </a>
        <a href="/" className={styles.link}>
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
          <div className="textWrapper">
            <p>Home</p>
          </div>
        </a>
        <a href="/" className={styles.link}>
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
          <div className="textWrapper">
            <p>Home</p>
          </div>
        </a>
        <a href="/" className={styles.link}>
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
          <div className="textWrapper">
            <p>Home</p>
          </div>
        </a>
        <p>
          {cookieWrapper.front.isConnected()
            ? `Connected as ${Cookies.get("session")}`
            : "Not Connected"}
        </p>
      </div>
    </header>
  );
}
