import styles from "./PopUp.module.css";
import { RxCross1 } from "react-icons/rx";

export default function PopUp(props: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClose: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  showCloseBtn?: boolean;
}) {
  let showCloseBtn = props.showCloseBtn ?? true;
  const title = props.title ?? "";
  return (
    <div className={`${props.className ?? ""} ${styles.popUp}`}>
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        
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
