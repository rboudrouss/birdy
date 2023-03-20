"use client";

import { APIPost, APIUser } from "@/helper/APIwrapper";
import cookieWrapper from "@/helper/cookiewrapper";
import userService from "@/helper/userService";
import { useState, useEffect } from "react";
import LoginPopUp from "./components/PopUp/LoginPopUp";
import PostComp from "./components/PostComp/PostComp";
import PostForm from "./components/PostForm/PostForm";
import styles from "./page.module.css";

export default function Home() {
  let [posts, setPosts] = useState<APIPost[]>([]);
  let [lastP, setLastP] = useState(0);
  let [user, setUser] = useState<APIUser | null>(null);
  let [showLoginPopUp, setShowLoginPopUp] = useState(false);

  // TODO fetchs 2 times, find a better way like useMemo ?
  useEffect(() => {
    if (!cookieWrapper.front.isConnected()) {
      setShowLoginPopUp(true);
    }
    userService.updateConnectedUser();

    async function getData() {
      let { data, message } = await userService.getRecentPosts(true);
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
      <h1>Home</h1>
      {showLoginPopUp && (
        <LoginPopUp
          onClose={() => {
            setShowLoginPopUp(false);
          }}
        />
      )}
      <PostForm parentPost={null} user={user} />
      {posts.map((post, i) => (
        <PostComp data={post} key={i} />
      ))}
    </main>
  );
}
