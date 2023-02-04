"use client";

import PostComp from "@/app/components/PostComp/PostComp";
import PostForm from "@/app/components/PostForm/PostForm";
import { PostJson, PostObj } from "@/helper/DBtoObj";
import userService from "@/helper/userService";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function PostId({ params }: { params: { id: number } }) {
  let [post, setPost] = useState<PostJson | null>(null);

  // TODO fetchs 2 times, find a better way like useMemo ?
  useEffect(() => {
    async function getData() {
      let { data, message } = await userService.getPostById(params.id);
      if (!data) {
        throw new Error(message);
      }
      setPost(new PostObj(data).json);
    }

    getData();
  }, [params.id]);

  return (
    <main className={styles.main}>
      {post && <PostComp data={post} />}
      {post && <PostForm parentPost={post.id} />}
    </main>
  );
}
