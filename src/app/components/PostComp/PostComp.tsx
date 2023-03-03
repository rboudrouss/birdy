"use client";

import { APIPost } from "@/helper/APIwrapper";
import styles from "./PostComp.module.css";
import { useEffect, useState } from "react";
import { FaHeart, FaComment, FaLink, FaTrash } from "react-icons/fa";
import userService from "@/helper/userService";
import cookieWrapper from "@/helper/cookiewrapper";
import PostForm from "../PostForm/PostForm";
import { UserTag } from "../UserTag/UserTag";

export default function PostComp(props: {
  data: APIPost;
  showReply?: boolean;
  className?: string;
}) {
  let post = props.data;
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(props.showReply || false);

  useEffect(() => {
    setLiked(userService.isPostLiked(props.data.id));
  }, [props.data.id]);

  const likeHandler = (e: any) => {
    e.preventDefault();
    // HACK might be redundant but let's try
    userService.updateConnectedUser();
    if (!cookieWrapper.front.isConnected()) return;

    if (liked) {
      post.dislike(userService.userId as number);
      post.nbLikes--;
    } else {
      post.like(userService.userId as number);
      post.nbLikes++;
    }
    setLiked(!liked);
    userService.updateConnectedUser();
  };

  const replyHandler = (e: any) => {
    e.preventDefault();
    setShowReply(!showReply);
  };

  const deleteHandler = async (e: any) => {
    e.preventDefault();
    await post.delete();
    window.location.reload();
  };

  return (
    <div className={`${props.className} ${styles.all}`}>
      <a href={props.data.postLink}>
        <div className={styles.julesDiv}>
        {props.data.replyId && <div className={styles.responseSpace}>
          <div></div>
          </div>}

        <article className={styles.wrapper}>
          <div className={styles.userDiv}>
            <UserTag post={props.data} className={styles.userTag} />
            {userService.userId == props.data.author?.id ? (
              <button onClick={deleteHandler} className={styles.delete}>
                {/* Delete */}
                <FaTrash />
              </button>
            ) : (
              <div />
            )}
          </div>
          <div className={styles.contentDiv}>
            <span className={styles.content}>{props.data.content.trim()}</span>
          </div>
          <div className={styles.buttonDiv}>
            <button onClick={replyHandler}>
              {/* Comment */}
              <p>{props.data.nbReplies}</p>
              <FaComment />
            </button>
            <button onClick={likeHandler}>
              {/* Like */}
              <p>{props.data.nbLikes}</p>
              <FaHeart color={liked ? "red" : "black"} />
            </button>
            <button>
              {/* Share Link */}
              <FaLink />
            </button>
          </div>
        </article>
        </div>
      </a>
      {showReply && (
        <PostForm
          parentPost={props.data}
          user={userService.getConnectedUser()}
        />
      )}
    </div>
  );
}
