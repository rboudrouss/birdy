"use client";

import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar(props: {
  placeholder?: string;
  onSearch?: (value: string) => void;
}) {
  const onSearch =
    props.onSearch ??
    ((input: string) => {
      window.location.href = `/search?s=${input}`;
    });
  const placeholder = props.placeholder ?? "Search";

  const [text, setText] = useState<string>("");

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onSubmit={(e) => onSearch(text)}
      />
      <input type="submit" value="Search" onClick={() => onSearch(text)} />
    </div>
  );
}
