"use client";

import { useState } from "react";
import styles from "./Dropdown.module.css";

/*
 * This component is used to display a dropdown menu.
 * The dropdown menu can be opened and closed by clicking on the button.
 * @param label: The label on the dropdown button.
 * @param className: CSS class name to be applied to the dropdown.
 * @param isOpen: if true, the dropdown will be opened by default.
 * @param fixed: if true, the dropdown will not be modified, depending on the default value
 */
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
