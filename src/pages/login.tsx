import userService from "@/helper/user.service";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";

export default function Profile() {
  // TODO check if user localStorage and valid
  let [email, setEmail] = useState("");
  let [passw, setPassw] = useState("");

  const login = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(email, passw);
    let resp = await userService.login(email, passw);
    console.log(resp);
  };

  return (
    <main>
      <form action="">
        <p>Email</p>
        <input type="mail" onChange={(e) => setEmail(e.target.value)} />
        <p>password</p>
        <input type="text" onChange={(e) => setPassw(e.target.value)} />
        <button type="submit" onClick={login}>
          Login
        </button>
      </form>
    </main>
  );
}
