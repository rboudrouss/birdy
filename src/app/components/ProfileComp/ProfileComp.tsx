"use client";

import { APIUser } from "@/helper/APIwrapper";
import userService from "@/helper/userService";
import { useState } from "react";
import AvatarImg from "../AvatarImg/AvatarImg";
import LikesPopUp from "../PopUp/LikesPopUp";
import styles from "./ProfileComp.module.css";

export default function ProfileComp(props: { user: APIUser | null }) {
  let [showFollowers, setShowFollowers] = useState(false);
  let [showFollowing, setShowFollowing] = useState(false);

  if (!props.user) return <></>;

  return (
    <div className={styles.wrapper}>
      {showFollowers && (
        <LikesPopUp
          Users={props.user.followerUsers}
          onClose={() => setShowFollowers(false)}
        />
      )}
      {showFollowing && (
        <LikesPopUp
          Users={props.user.followingUsers}
          onClose={() => setShowFollowing(false)}
        />
      )}

      <div className={styles.userTag}>
        <AvatarImg
          url={props.user.avatarImg}
          width={100}
          height={100}
          className={styles.avatarImg}
          priority={true}
        />
        <div className={styles.followButtonDiv}>
          <FollowButton user={props.user} />
        </div>
      </div>
      <div className={styles.bioNStats}>
        <div className={styles.bioDiv}>
          <div className={styles.usernameDiv}>
            <h1 className={styles.username}>{props.user.username}</h1>
          </div>
          <p className={styles.bio}>{props.user.bio}</p>
        </div>
        <div className={styles.stats}>
          <a className={styles.statNumber} href={`/profile/${props.user.id}`}>
            {props.user.posts.length} posts
          </a>
          <a
            className={styles.statNumber}
            href={`/profile/${props.user.id}/likes`}
          >
            {props.user.likes.length} likes
          </a>
          <p
            className={styles.statNumber}
            onClick={() => setShowFollowers(true)}
          >
            {props.user.followers.length} followers
          </p>
          <p
            className={styles.statNumber}
            onClick={() => setShowFollowing(true)}
          >
            {props.user.following.length} following
          </p>
        </div>
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
          setIsFollow(true);
          await props.user.follow(id);
          userService.updateConnectedUser();
        }}
      >
        Follow
      </button>
    );

  return (
    <button
      className={styles.followButton}
      onClick={async () => {
        setIsFollow(false);
        await props.user.unfollow(id);
        userService.updateConnectedUser();
      }}
    >
      Unfollow
    </button>
  );
}
