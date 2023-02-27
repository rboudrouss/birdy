"use client";

import { useState } from 'react';
import styles from './Dropdown.module.css';

export const Dropdown = (
  props: React.PropsWithChildren<{
    label: string;
    className?: string;
    isOpen?: boolean;
  }>
) => {
  const [isOpen, setIsOpen] = useState(props.isOpen ?? false);

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {props.label}
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>{props.children}</div>
      )}
    </div>
  );
};




