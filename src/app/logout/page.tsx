"use client";

import userService from "@/helper/userService";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    userService.logout();
  });

  return (
    <>
      <h1>Login out</h1>
    </>
  );
}
