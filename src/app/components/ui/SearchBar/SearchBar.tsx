"use client";

import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar(props: {
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}) {
  const onSearch =
    props.onSearch ??
    ((input: string) => {
      window.location.href = `/search?s=${input}`;
    });
  const placeholder = props.placeholder ?? "Search";

  const [text, setText] = useState<string>("");

  return (
    <form
      className={`${styles.searchBar} ${props.className ?? ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(text);
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onSubmit={() => onSearch(text)}
        defaultValue={props.defaultValue ?? ""}
        className={styles.input}
      />
      <input
        className={styles.submit}
        type="submit"
        value="Search"
        onClick={() => onSearch(text)}
      />
    </form>
  );
}
