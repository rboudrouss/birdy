import userService from "@/helper/user.service";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";

export default function Login() {
  let [email, setEmail] = useState("");
  let [passw, setPassw] = useState("");

  const login = async (e: any) => {
    e.preventDefault();
    console.log(email, passw);
    let resp = await userService.login(email, passw);
  };

  return (
    <main>
      <form onSubmit={login}>
        <p>Email</p>
        <input type="email" required={true} onChange={(e) => setEmail(e.target.value)} />
        <p>password</p>
        <input type="text" required={true} onChange={(e) => setPassw(e.target.value)} />
        <button type="submit" onClick={login}>
          Login
        </button>
      </form>
    </main>
  );
}
