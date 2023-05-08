"use client";

// HACK, en vrai on devrait plutôt mettre dans un fichier layout.tsx
// les trucs en commun entre les pages et utiliser un react context

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
      let user = await APIUser.fetch(props.params.id);
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
        selected="Posts"
        options={["Posts", "Replies", "Likes"]}
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
