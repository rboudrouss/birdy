"use client";

import PostComp from "@/app/components/PostComp/PostComp";
import PostForm from "@/app/components/PostForm/PostForm";
import { APIPost, APIUser } from "@/helper/APIwrapper";
import userService from "@/helper/userService";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function PostId({ params }: { params: { id: number } }) {
  let [post, setPost] = useState<APIPost | null>(null);
  let [user, setUser] = useState<APIUser | null>(null);

  // TODO fetchs 2 times, find a better way
  useEffect(() => {
    async function getData() {
      let { data, message } = await userService.getPostById(params.id);
      if (!data) {
        throw new Error(message);
      }
      setPost(new APIPost(data));
      setUser(userService.getConnectedUser());
    }

    getData();
  }, [params.id]);

  return (
    <main className={styles.main}>
      {post && <PostComp data={post} />}
      {post &&
        post.replies?.map((reply, i) => <PostComp data={reply} key={i} />)}
      {post && <PostForm parentPost={post} user={user} />}
    </main>
  );
}
