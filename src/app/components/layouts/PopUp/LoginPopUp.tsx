import PopUp from "./PopUp";
import LoginForm from "../../form/LoginForm/LoginForm";
import styles from "./LoginPopUp.module.css";

export default function LoginPopUp(
  props: {
  className?: string;
  onClose: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  showCloseBtn?: boolean;
  } 
) {
  return (
    <PopUp className={props.className} onClose={props.onClose} showCloseBtn={props.showCloseBtn}>
        <div className={styles.loginPopUpContent}>
          <LoginForm />
          or <a href="/register">register</a>
        </div>
    </PopUp>
  )
}