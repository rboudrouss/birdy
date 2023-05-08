"use client";

import cookieWrapper from "@/helper/cookiewrapper";
import LoginForm from "../components/form/LoginForm/LoginForm";

export default function Login() {
  if (cookieWrapper.front.isConnected()) window.location.href = "/";
  return (
    <main>
      <h1>Login</h1>
      <LoginForm />
    </main>
  );
}
