"use client";

import PostComp from "@/app/components/PostComp/PostComp";
import ProfileComp from "@/app/components/ProfileComp/ProfileComp";
import { APIUser } from "@/helper/APIwrapper";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Profile(props: { params: { id: number } }) {
  let [user, setUser] = useState<APIUser | null>(null);
  let [showResp, setShowResp] = useState(true);

  useEffect(() => {
    async function getData() {
      let user = await APIUser.fetch(props.params.id);
      setUser(user);
    }

    getData();
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Profile</h1>
      <ProfileComp user={user} />
      {user?.posts &&
        user.posts.map((post, i) => <PostComp data={post} key={i} />)}
    </main>
  );
}
