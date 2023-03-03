"use client";

import { APIUser } from "@/helper/APIwrapper";
import { fetchWrapper } from "@/helper/fetchwrapper";
import userService from "@/helper/userService";
import { useState } from "react";
import AvatarImg from "../AvatarImg/AvatarImg";
import styles from "./ProfileComp.module.css";

export default function ProfileComp(props: { user: APIUser | null }) {
  if (!props.user) return <></>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.userTag}>
        <AvatarImg
          url={props.user.avatarImg}
          width={100}
          height={100}
          className={styles.avatarImg}
        />
        <div className={styles.followButtonDiv}>
          <FollowButton user={props.user} />
        </div>
      </div>
      <div className={styles.bioDiv}>
        <div className={styles.usernameDiv}>
          <h1 className={styles.username}>{props.user.username}</h1>
        </div>
        <p className={styles.bio}>{props.user.bio}</p>
      </div>
    </div>
  );
}

function FollowButton(props: { user: APIUser }) {
  let connectedUser = userService.getConnectedUser();

  let [isFollow, setIsFollow] = useState(
    connectedUser?.following.includes(props.user.id) ?? false
  );

  if (!connectedUser)
    return (
      <button
        className={styles.followButton}
        onClick={() => (window.location.href = "/login")}
      >
        login
      </button>
    );

  let id = connectedUser.id;

  if (id === props.user.id)
    return (
      <button
        className={styles.followButton}
        onClick={() => (window.location.href = "/settings")}
      >
        Edit Profile
      </button>
    );

  if (!isFollow)
    return (
      <button
        className={styles.followButton}
        onClick={async () => {
          await props.user.follow(id);
          userService.updateConnectedUser();
          setIsFollow(true);
        }}
      >
        Follow
      </button>
    );

  return (
    <button
      className={styles.followButton}
      onClick={async () => {
        await props.user.unfollow(id);
        userService.updateConnectedUser();
        setIsFollow(false);
      }}
    >
      Unfollow
    </button>
  );
}
