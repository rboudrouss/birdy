"use client";

import SearchBar from "@/app/components/ui/SearchBar/SearchBar";
import { APIPost } from "@/helper/APIwrapper";
import userService from "@/helper/userService";
import { useEffect, useState } from "react";
import PostComp from "../components/ui/PostComp/PostComp";

export default function Page() {
  let [first, setFirst] = useState<boolean>(true);
  let [searchText, setSearchText] = useState<string>("");
  let [data, setData] = useState<APIPost[]>([]);

  useEffect(() => {
    async function getData() {
      if (searchText) setData(await userService.search(searchText));
    }

    if (first) {
      setSearchText(new URLSearchParams(window.location.search).get("s") || "");
      setFirst(false);
    }

    getData();
  }, [searchText]);

  return (
    <>
      <h1>Search</h1>
      <SearchBar onSearch={(e) => setSearchText(e)} />
      <p>{searchText}</p>
      {data.map((post, i) => (
        <PostComp data={post} key={i} />
      ))}
    </>
  );
}
