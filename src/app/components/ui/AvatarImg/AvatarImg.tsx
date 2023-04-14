import Image from "next/image";
import styles from "./AvatarImg.module.css";

/*
 * This component is used to display the avatar image of the user using the next/image component.
 * The next/image component is used to optimize the image loading and to lazy load the images.
 *
 * @param url: The url of the image
 * @param width: width
 * @param height: height
 * @param className: CSS class name to be applied to the image.
 * @param priority: if true, the image will be prioritized to be loaded.
 */
export default function AvatarImg(props: {
  url: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      unoptimized
      src={props.url}
      alt="Avatar"
      width={props.width ?? 100}
      height={props.height ?? 100}
      className={`${props.className ?? ""} ${styles.avatarImg}`}
      priority={props.priority}
    />
  );
}
