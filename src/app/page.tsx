"use client";

import { PostJson, PostObj } from "@/helper/DBtoObj";
import userService from "@/helper/userService";
import { Post, User } from "@prisma/client";
import { useState, useEffect } from "react";
import PostComp from "./components/PostComp/PostComp";
import styles from "./page.module.css";

export default function Home() {
  let [posts, setPosts] = useState<PostJson[]>([]);
  let [lastP, setLastP] = useState(0);

  // TODO fetchs 2 times, find a better way like useMemo ?
  useEffect(() => {
    async function getData() {
      let { data, message } = await userService.getRecentPosts();
      if (!data) {
        throw new Error(message);
      }
      setPosts(data.data.map((post) => new PostObj(post).json));
      setLastP(data.end);
    }

    getData();
  }, []);
  console.log(posts);

  return (
    <main className={styles.main}>
      <h1>helloow</h1>
      {posts.map((post, i) => (
        <PostComp data={post} key={i} />
      ))}
    </main>
  );
}
