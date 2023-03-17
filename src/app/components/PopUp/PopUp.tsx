import styles from "./PopUp.module.css";
import { RxCross1 } from "react-icons/rx";

export default function PopUp(props: {
  children: React.ReactNode;
  className?: string;
  onClose: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  showCloseBtn?: boolean;
}) {
  let showCloseBtn = props.showCloseBtn ?? true;
  return (
    <div className={`${props.className} ${styles.popUp}`}>
      <div className={styles.btns}>
        {showCloseBtn && (
          <div className={styles.closeBtn} onClick={props.onClose}>
            <RxCross1 />
          </div>
        )}
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
