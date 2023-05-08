"use client";

import SearchBar from "@/app/components/ui/SearchBar/SearchBar";
import { APIPost, APIUser } from "@/helper/APIwrapper";
import userService from "@/helper/userService";
import { useEffect, useState } from "react";
import PostComp from "../components/ui/PostComp/PostComp";
import UserCard from "../components/ui/UserCard/UserCard";
import styles from "./page.module.css";

export default function Page() {
  let [first, setFirst] = useState<boolean>(true);
  let [searchText, setSearchText] = useState<string>("");
  let [data, setData] = useState<{ users: APIUser[]; posts: APIPost[] }>({
    users: [],
    posts: [],
  });

  const users = data.users;
  const posts = data.posts;

  useEffect(() => {
    async function getData() {
      if (searchText) setData(await userService.search(searchText));
    }

    if (first) {
      setSearchText(new URLSearchParams(window.location.search).get("s") || "");
      setFirst(false);
    }

    getData();
  }, [searchText]);

  return (
    <>
      <h1 className={styles.title}>Search</h1>
      <SearchBar onSearch={(e) => setSearchText(e)} defaultValue={searchText} />
      {users && users.length !== 0 && (
        <>
          <h2 className={styles.subtitle}>Users</h2>
          <UserCarousel users={users} />
        </>
      )}
      {posts && posts.length !== 0 && (
        <>
          <h2 className={styles.subtitle}>Posts</h2>
          {posts.map((post, i) => (
            <PostComp data={post} key={i} />
          ))}
        </>
      )}
      {(!users || users.length === 0) && (!posts || posts.length === 0) && (
        <h1 className={styles.subtitle}>Nothing found</h1>
      )}
    </>
  );
}

function UserCarousel(props: { users: APIUser[] }) {
  return (
    <div className={styles.carousel}>
      {props.users.map((user, i) => (
        <UserCard user={user} key={i} />
      ))}
    </div>
  );
}
