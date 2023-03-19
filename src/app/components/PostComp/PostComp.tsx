"use client";

import { APIPost, APIUser } from "@/helper/APIwrapper";
import styles from "./PostComp.module.css";
import { useEffect, useState } from "react";
import { FaHeart, FaComment, FaLink, FaTrash } from "react-icons/fa";
import userService from "@/helper/userService";
import cookieWrapper from "@/helper/cookiewrapper";
import PostForm from "../PostForm/PostForm";
import { UserTag } from "../UserTag/UserTag";
import SurePopUp from "../PopUp/SurePopUp";
import LikesPopUp from "../PopUp/LikesPopUp";

export default function PostComp(props: {
  data: APIPost;
  showReply?: boolean;
  className?: string;
  showShowMore?: boolean;
}) {
  let post = props.data;
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(props.showReply || false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [showLikesPopUp, setShowLikesPopUp] = useState(false);

  useEffect(() => {
    setLiked(userService.isPostLiked(props.data.id));
  }, [props.data.id]);

  const likeHandler = (e: any) => {
    e.stopPropagation();
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
    if(liked){
      post.likesUsers = post.likesUsers.filter(user => user.id !== userService.userId);
    } else {
      post.likesUsers.push(userService.getConnectedUser() as APIUser);
    }
  };

  const replyHandler = (e: any) => {
    e.stopPropagation();
    setShowReply(!showReply);
  };

  const deleteHandler = async (e: any) => {
    e.stopPropagation();
    setShowDeletePopUp(false);
    await post.delete();
    window.location.href = "/";
  };

  const clickDelete = (e: any) => {
    e.stopPropagation();
    setShowDeletePopUp(true);
  };

  return (
    <div className={`${props.className ?? ""} ${styles.all}`}>
      {showDeletePopUp && (
        <SurePopUp
          onYes={deleteHandler}
          onClose={() => setShowDeletePopUp(false)}
        />
      )}
      {showLikesPopUp && (
        <LikesPopUp
          onClose={() => setShowLikesPopUp(false)}
          Users={props.data.likesUsers}
        />
      )}
      <div className={styles.julesDiv}>
        {props.data.replyId && (
          <div className={styles.responseSpace}>
            <div className={styles.responseBar}></div>
          </div>
        )}

        <article
          className={styles.wrapper}
          onClick={() => {
            window.location.href = props.data.postLink;
          }}
        >
          <div className={styles.userDiv}>
            <UserTag post={props.data} className={styles.userTag} />
            {userService.userId == props.data.author?.id ? (
              <>
                <button onClick={clickDelete} className={styles.delete}>
                  {/* Delete */}
                  <FaTrash />
                </button>
              </>
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
            <div className={styles.likesDiv}>
              <button onClick={likeHandler}>
                {/* Like */}
                <FaHeart color={liked ? "red" : "black"} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLikesPopUp(!showLikesPopUp);
                }}
                className={styles.showLikes}
              >
                <p className={styles.nbLikesText}>{props.data.nbLikes}</p>
              </button>
            </div>
            <button>
              {/* Share Link */}
              <FaLink />
            </button>
          </div>
        </article>
      </div>
      {showReply && (
        <PostForm
          parentPost={props.data}
          user={userService.getConnectedUser()}
        />
      )}
    </div>
  );
}
