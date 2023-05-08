import { APIPost, APIUser } from "@/helper/APIwrapper";
import AvatarImg from "../../ui/AvatarImg/AvatarImg";
import styles from "./UserCard.module.css";

export default function UserCard(
  props: (
    | {
        post: APIPost | null;
      }
    | {
        user: APIUser | null;
      }
  ) & {
    className?: string;
  }
) {
  let post: APIPost | null | undefined = (props as any).post;
  let user: APIUser | null | undefined = (props as any).user;

  if (!post && !user) return <></>;
  if (post && !post.author) return <></>;
  if (post) user = post.author;
  if (!user) return <></>;

  return (
    <a
      href={user.profileLink}
      className={`${props.className ?? ""} ${styles.userTag}`}
    >
      <AvatarImg
        url={user.avatarImg}
        width={50}
        height={50}
        className={styles.avatar}
      />
      <div className={styles.textDiv}>
        <span className={styles.username}>{user.username}</span>
      </div>
    </a>
  );
}
function timeSince(date: Date) {
  var seconds = Math.floor((Date.now() - (date as any)) / 1000);

  let interval = seconds / 86400;
  if (interval > 3) {
    return date.toDateString().slice(4, 10);
  }

  if (interval > 2) {
    return "2 days ago";
  }

  if (interval > 1) {
    return "yesterday";
  }

  interval = seconds / 3600;
  if (interval > 2) {
    return Math.floor(interval) + " hours ago";
  }

  if (interval > 1) {
    return "an hour ago";
  }

  interval = seconds / 60;
  if (interval > 2) {
    return Math.floor(interval) + " minutes ago";
  }

  if (interval > 1) {
    return "a minute ago";
  }

  return Math.floor(seconds) + " seconds ago";
}
