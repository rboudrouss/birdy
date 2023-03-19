import styles from "./InfoBar.module.css";
import { FaGithub } from "react-icons/fa";

export default function InfoBar() {
  return (
    <div className={styles.infoBar}>
      <div className={styles.footer}>
        <div className={styles.icons}>
          <a href="https://github.com/rboudrouss/birdy">
            <FaGithub /> Github
          </a>
        </div>
        <div className={styles.author}>
          <span>
            <a href="https://rboud.com">rboud</a>- 2023 - MIT License
          </span>
        </div>
      </div>
    </div>
  );
}
