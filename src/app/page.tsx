"use client";

import { APIPost, APIUser } from "@/helper/APIwrapper";
import cookieWrapper from "@/helper/cookiewrapper";
import userService from "@/helper/userService";
import { useState, useEffect } from "react";
import PostComp from "./components/PostComp/PostComp";
import PostForm from "./components/PostForm/PostForm";
import styles from "./page.module.css";

export default function Home() {
  let [posts, setPosts] = useState<APIPost[]>([]);
  let [lastP, setLastP] = useState(0);
  let [user, setUser] = useState<APIUser | null>(null);

  // TODO fetchs 2 times, find a better way like useMemo ?
  useEffect(() => {
    if (!cookieWrapper.front.isConnected()) {
      window.location.href = "/login";
      return;
    }

    async function getData() {
      let { data, message } = await userService.getRecentPosts();
      if (!data) {
        throw new Error(message);
      }
      setPosts(data.data.map((post) => new APIPost(post)));
      setLastP(data.end);
      setUser(userService.getConnectedUser());
    }

    getData();
  }, []);

  return (
    <main className={styles.main}>
      <h1>helloow</h1>
      <PostForm parentPost={null} user={user} />
      {posts.map((post, i) => (
        <PostComp data={post} key={i} />
      ))}
    </main>
  );
}
