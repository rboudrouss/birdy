import styles from "./InfoBar.module.css";
import { FaGithub } from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";

export default function InfoBar() {
  return (
    <div className={styles.infoBar}>
      <SearchBar />
      <div className={styles.footer}>
        <div className={styles.icons}>
          <a href="https://github.com/rboudrouss/birdy">
            <FaGithub /> Github
          </a>
        </div>
        <div className={styles.author}>
          <span>
            <a href="https://rboud.com">rboud</a>- 2023 - GPL3 License
          </span>
        </div>
      </div>
    </div>
  );
}
