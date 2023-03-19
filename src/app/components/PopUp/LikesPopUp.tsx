import { APIUser } from "@/helper/APIwrapper";
import AvatarImg from "../AvatarImg/AvatarImg";
import PopUp from "./PopUp";
import styles from "./LikesPopUp.module.css"

export default function LikesPopUp(props: {
  Users: APIUser[];
  onClose: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  className?: string;
}) {
  return <PopUp onClose={props.onClose} className={`${props.className ?? ''} ${styles.popUp}`}>
    <div className="">
      {props.Users.map((user, i) => (
        <div key={i} className={styles.userElement} onClick={() => {window.location.href = user.profileLink}}>
          <AvatarImg url={user.avatarImg} width={30} height={30} />
          <span className={styles.usernameText}>{user.username}</span>
        </div>
      ))}
    </div>
  </PopUp>;
}
