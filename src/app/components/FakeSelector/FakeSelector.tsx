"use client";

import styles from "./FakeSelector.module.css";

export default function FakeSelector(
  props: {
    selected: string;
    options: string[];
    urls: string[];
  }
){
  return (
    <div className={styles.fakeSelector}>
      {props.options.map((option, i) => (
        <a href = {props.urls[i]} className={styles.option} key={i}>
          <div className={styles.optionText}>{option}</div>
          {props.selected === option && <div className={styles.selected}></div>}
        </a>
      ))}

    </div>
  )

}