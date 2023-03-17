import styles from "./ChoicePopUp.module.css";
import PopUp from "../PopUp/PopUp";

// if no onNo is provided, then the onClose function will be used instead
export default function ChoicePopUp(props: {
  children: React.ReactNode;
  className?: string;
  onClose: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  showCloseBtn?: boolean;
  onYes: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  onNo?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}) {
  let onNo = props.onNo ?? props.onClose;
  return (
    <PopUp
      className={`${props.className ?? ""} ${styles.choicePopUp}`}
      onClose={props.onClose}
      showCloseBtn={props.showCloseBtn}
    >
      <div className={styles.content}>{props.children}</div>
      <div className={styles.btns}>
        <button className={styles.noBtn} onClick={onNo}>
          No
        </button>
        <button className={styles.yesBtn} onClick={props.onYes}>
          Yes
        </button>
      </div>
    </PopUp>
  );
}
