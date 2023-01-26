import axios from "axios";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";

export default function Profile() {
  let [email, setEmail] = useState("");
  let [passw, setPassw] = useState("");
  let [bio, setBio] = useState("");
  let [username, setUsername] = useState("");
  const router = useRouter();

   const login = (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(username, email, passw, bio);
    axios.post((process.env.URL as string), {})
  };

  return (
    <main>
      <form action="">
        <p>Username</p>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
        <p>Email</p>
        <input type="mail" onChange={(e) => setEmail(e.target.value)} />
        <p>password</p>
        <input type="text" onChange={(e) => setPassw(e.target.value)} />
        <p>Bio (facultatif)</p>
        <input type="text" onChange={(e) => setBio(e.target.value)} />
        <button type="submit" onClick={login}>
          Login
        </button>
      </form>
    </main>
  );
}

//  const login = (e) => {
//     e.preventDefault();
//     console.log(name, email, password);
//     const userData = {
//       name,
//       email,
//       password,
//     };
//     localStorage.setItem('token-info', JSON.stringify(userData));
//     setIsLoggedin(true);
//     setName('');
//     setEmail('');
//     setPassword('');
//   };
