"use client";

import { APIPost, APIUser } from "@/helper/APIwrapper";
import userService from "@/helper/userService";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import AvatarImg from "../AvatarImg/AvatarImg";
import styles from "./PostForm.module.css";

function color(length:number){
  if (length > 256) return "red";
  if (length > 230) return "orange";
  return "black";
}

export default function PostForm(props: {
  parentPost: APIPost | null;
  user: APIUser | null;
}) {
  let [content, setContent] = useState("");

  if (!props.user) return <></>;

  const post = async (e: any) => {
    e.preventDefault();
    if (!content || content.length > 256) return;

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
          <AvatarImg
            url={props.user.avatarImg}
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
              <span className={styles.error} style={{
                color: color(content.length)
              }}>
                ({content.length}/256)
              </span>
            )
              }
            <button type="submit" onClick={post} className={styles.postButton} color="red">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
