"use client";

import FakeSelector from "@/app/components/ui/FakeSelector/FakeSelector";
import PostComp from "@/app/components/ui/PostComp/PostComp";
import ProfileComp from "@/app/components/ui/ProfileComp/ProfileComp";
import { APIUser } from "@/helper/APIwrapper";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Profile(props: { params: { id: number } }) {
  let [user, setUser] = useState<APIUser | null>(null);
  let [showResp, setShowResp] = useState(true);

  useEffect(() => {
    async function getData() {
      let user = await APIUser.fetch(props.params.id, true);
      setUser(user);
    }

    getData();
  }, [props.params.id]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Profile</h1>
      <ProfileComp user={user} />
      <FakeSelector
        selected="Replies"
        options={["Posts", "Replies" ,"Likes"]}
        urls={[
          `/profile/${props.params.id}`,
          `/profile/${props.params.id}/replies`,
          `/profile/${props.params.id}/likes`,
        ]}
      />
      {user?.posts &&
        user.posts.map((post, i) => <PostComp data={post} key={i} />)}
    </main>
  );
}
