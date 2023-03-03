import { APIPost, APIUser } from "@/helper/APIwrapper";
import AvatarImg from "../AvatarImg/AvatarImg";
import styles from "./UserTag.module.css";

export function UserTag(
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
        {post?.replyTo?.author && (
          <span className={styles.replyToText}>
            reply to {post?.replyTo.author.username}
          </span>
        )}
          {post?.createdAt && (<span className={styles.dateText}>{post.createdAt.toDateString().slice(4, 10)}
            </span>)}
      </div>
    </a>
  );
}
