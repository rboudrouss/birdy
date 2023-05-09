"use client";

import { APIPost, APIUser } from "@/helper/APIwrapper";
import { defaultAvatarUrl } from "@/helper/constants";
import userService from "@/helper/userService";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import AvatarImg from "../../ui/AvatarImg/AvatarImg";
import styles from "./PostForm.module.css";

function color(length: number) {
  if (length > 256) return "red";
  if (length > 230) return "orange";
  return "black";
}

export default function PostForm(props: {
  parentPost: APIPost | null;
  user: APIUser | null;
}) {
  let [content, setContent] = useState("");
  let [posting, setPosting] = useState(false);

  const post = async (e: any) => {
    e.preventDefault();
    if (posting) return;
    if (!props.user) return alert("You need to be connected to post something");
    if (!content || content.length > 256) return;

    setPosting(true);

    if (props.parentPost) {
      let post = await props.parentPost.reply(
        content.trim(),
        (props.user as APIUser).id
      );
      window.location.href = post.postLink;
      setPosting(false);
      return;
    }

    await userService.createPost(content, (props.user as APIUser).id);
    setPosting(false);
  };

  return (
    <div className={styles.wrapper}>
      <a href={props.user?.profileLink}>
        <AvatarImg
          url={props.user?.avatarImg ?? defaultAvatarUrl}
          width={50}
          height={50}
          className={styles.avatar}
        />
      </a>
      <div className={styles.form}>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          name="content"
          placeholder="What's on your mind?"
          className={styles.textarea}
          readOnly={!props.user}
        />

        <div className={styles.actions}>
          <div>
            <button
              onClick={() => alert("Not implemented yet")}
              className={styles.imgButton}
            >
              <FaImage />
            </button>
          </div>
          <div>
            {content.length > 200 && (
              <span
                className={styles.error}
                style={{
                  color: color(content.length),
                }}
              >
                ({content.length}/256)
              </span>
            )}
            <button type="submit" onClick={post} className={styles.postButton}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
