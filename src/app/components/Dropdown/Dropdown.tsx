"use client";

import { useState } from "react";
import styles from "./Dropdown.module.css";

export const Dropdown = (
  props: React.PropsWithChildren<{
    label: string;
    className?: string;
    isOpen?: boolean;
    fixed?: boolean;
  }>
) => {
  const [isOpen, setIsOpen] = useState(props.isOpen ?? false);

  return (
    <div className={`${styles.dropdown} ${props.fixed && styles.fixed}`}>
      <button
        className={styles.dropdownButton}
        onClick={() => !props.fixed && setIsOpen(!isOpen)}
      >
        {props.label}
      </button>
      {isOpen && <div className={styles.dropdownContent}>{props.children}</div>}
    </div>
  );
};
