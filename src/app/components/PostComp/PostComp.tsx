"use client";

import { PostJson, PostObj } from "@/helper/DBtoObj";
import styles from "./PostComp.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
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
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button>
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button>
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button>
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </article>
  );
}
