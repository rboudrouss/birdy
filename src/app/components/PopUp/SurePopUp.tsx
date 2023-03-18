import ChoicePopUp from "./ChoicePopUp";
import styles from "./SurePopUp.module.css";

export default function SurePopUp(props: {
  text?: string;
  onYes: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  onNo?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  onClose: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  className?: string;
  showCloseBtn?: boolean;
}) {
  let text = props.text ?? "Êtes vous sûr.e ?";
  return (
    <ChoicePopUp
      className={props.className}
      onClose={props.onClose}
      showCloseBtn={props.showCloseBtn}
      onYes={props.onYes}
      onNo={props.onNo}
    >
      <span className={styles.text}>{text}</span>
    </ChoicePopUp>
  );
}
