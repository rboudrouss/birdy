"use client";

import ProfileComp from "@/app/components/ProfileComp/ProfileComp";
import { APIUser } from "@/helper/APIwrapper";
import { useState, useEffect } from "react";
import styles from "./page.module.css"; 

export default function Profile(props: {params: {id: number}}) {

  let [user, setUser] = useState<APIUser | null>(null);

  useEffect(() => {
    async function getData() {
      let user = await APIUser.fetch(props.params.id);
      setUser(user);
    }

    getData();
  }, [])

  return <main className={styles.main}>
    <h1>Profile</h1>
    <ProfileComp user={user} />
  </main>;
}
