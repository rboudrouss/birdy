import userService from "@/helper/userService";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";

export default function Register() {
  let [email, setEmail] = useState("");
  let [passw, setPassw] = useState("");
  let [bio, setBio] = useState("");
  let [username, setUsername] = useState("");

  const register = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(email, passw, bio, username);
    let resp = await userService.register({
      email,
      password: passw,
      bio,
      username,
    });
    console.log(resp);
  };

  return (
    <main>
      <form action="">
        <p>Username</p>
        <input type="text" required onChange={(e) => setUsername(e.target.value)} />
        <p>Email</p>
        <input type="email" required onChange={(e) => setEmail(e.target.value)} />
        <p>password</p>
        <input type="text" required onChange={(e) => setPassw(e.target.value)} />
        <p>Bio (facultatif)</p>
        <input type="text" onChange={(e) => setBio(e.target.value)} />
        <button type="submit" onClick={register}>
          register
        </button>
      </form>
    </main>
  );
}
