"use client";

import { APIPost, APIUser } from "@/helper/APIwrapper";
import userService from "@/helper/userService";
import { useState } from "react";
import styles from "./PostForm.module.css";

export default function PostForm(props: {
  parentPost: APIPost | null;
  user: APIUser | null;
}) {
  let [content, setContent] = useState("");

  if (!props.user) return <></>;

  const post = async (e: any) => {
    e.preventDefault();
    if (props.parentPost) {
      let post = await props.parentPost.reply(
        content.trim(),
        (props.user as APIUser).id
      );
      window.location.href = post.postLink;
      return;
    }

    await userService.createPost(content, (props.user as APIUser).id);
  };

  return (
    <div className={styles.wrapper}>
      <a href={props.user.profileLink}>
        <div className={styles.header}>
          <img
            src={props.user.avatarImg}
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.name}>{props.user.username}</div>
        </div>
      </a>
      <form onSubmit={post}>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          name="content"
          placeholder="What's on your mind?"
        />

        <div className={styles.actions}>
          <button type="submit" onClick={post}>
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
