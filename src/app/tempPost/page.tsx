"use client";

import userService from "@/helper/userService";
import { MouseEvent, useState } from "react";

export default function Post() {
  let [author, setAuthor] = useState("");
  let [content, setContent] = useState("");

  const post = async (e: any) => {
    e.preventDefault();
    console.log(author, content);
    await userService.createPost(content, author);
  };

  return (
    <main>
      <form onSubmit={post}>
        <p>Author</p>
        <input
          type="number"
          required={true}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <p>content</p>
        <input
          type="text"
          required={true}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" onClick={post}>
          Post
        </button>
      </form>
    </main>
  );
}
