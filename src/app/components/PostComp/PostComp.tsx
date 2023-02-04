"use client";

import { PostJson, PostObj } from "@/helper/DBtoObj";
import styles from "./PostComp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
export default function PostComp(props: { data: PostJson }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className={styles.wrapper}>
      <a href={props.data.postLink}>
        <div className={styles.userDiv}>
          <span className={styles.username}>{props.data.author?.username}</span>
        </div>
        <div className={styles.contentDiv}>
          <span className={styles.content}>{props.data.content}</span>
        </div>
      </a>
      <div className={styles.buttonDiv}>
        <button>
          {/* Comment */}
          <FontAwesomeIcon icon={faComment} />
        </button>
        <button>
          {/* Like */}
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button>
          {/* Open new window */}
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button>
          {/* Share Link */}
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </article>
  );
}
