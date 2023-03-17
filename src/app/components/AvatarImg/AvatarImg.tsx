import Image from "next/image"
import styles from "./AvatarImg.module.css"

export default function AvatarImg(props : {url :string, width? :number, height? :number, className? :string}) {
  return (
    <Image
    unoptimized
    src = {props.url}
    alt = "Avatar"
    width = {props.width ?? 100}
    height = {props.height ?? 100}
    className = {`${props.className} ${styles.avatarImg}`}
    />
  )

}