"use client";

import { useState } from "react";
import styles from "./CustomInput.module.css";

export default function CustomInput(props: {
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  defaultValue?: string | null;
}) {
  const [focused, setFocused] = useState(false);

  const type = props.type ?? "text";
  const required = props.required ?? false;

  return (
    <div className={styles.field}>
      <input
        className={`${styles.input} ${focused ? styles.focussed : ""}`}
        id={props.id}
        type={type}
        placeholder={props.label}
        onChange={props.onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        defaultValue={props.defaultValue ?? ""}
      />
      <label htmlFor={props.id} className={styles.label}>{props.label}</label>
    </div>
  );
}
