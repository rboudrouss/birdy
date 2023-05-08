"use client";
import { MouseEventHandler } from "react";
import styles from "./CustomButton.module.css";

export default function CustomButton(
  props: {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
  }
){
  const type = props.type ?? undefined;
  return (
    <button type={type} onClick={props.onClick} className={styles.button}>
      {props.label}
    </button>
  );
}