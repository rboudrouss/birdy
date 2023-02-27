import { APIUser } from "@/helper/APIwrapper";
import styles from "./ProfileComp.module.css";

export default function ProfileComp(props: { user: APIUser | null }) {
  if (!props.user)
  return <></>;

  return (
    <div className={styles.wrapper}>
      <img src={props.user.avatarImg} className={styles.avatar}/>
      <h1>{props.user.username}</h1>
      <p>{props.user.bio}</p>
    </div>
  );
}
