import styles from "./AvatarImg.module.css";
import defaultAvatar from "@/../public/defaultAvatar.png";
import Image from "next/image";

export default function AvatarImg(props: { src?: string }) {
  if (!props.src) {
    return <Image src={defaultAvatar} alt="avatar" />;
  }
  return <Image src={props.src} alt="avatar" />;
}
