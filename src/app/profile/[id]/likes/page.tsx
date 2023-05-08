"use client";

// HACK, utiliser un context react & layout.tsx

import FakeSelector from "@/app/components/ui/FakeSelector/FakeSelector";
import PostComp from "@/app/components/ui/PostComp/PostComp";
import ProfileComp from "@/app/components/ui/ProfileComp/ProfileComp";
import { APIUser } from "@/helper/APIwrapper";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Profile(props: { params: { id: number } }) {
  let [user, setUser] = useState<APIUser | null>(null);

  useEffect(() => {
    async function getData() {
      let user = await APIUser.fetch(props.params.id, false, true);
      setUser(user);
      console.log("user data\n", user);
    }

    getData();
  }, [props.params.id]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Profile</h1>
      <ProfileComp user={user} />
      <FakeSelector
        selected="Likes"
        options={["Posts", "Replies", "Likes"]}
        urls={[
          `/profile/${props.params.id}`,
          `/profile/${props.params.id}/replies`,
          `/profile/${props.params.id}/likes`,
        ]}
      />
      {user?.likedPosts &&
        user.likedPosts.map((like, i) => <PostComp data={like} key={i} />)}
    </main>
  );
}
