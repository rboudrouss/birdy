import Router from "next/router";
import { fetchWrapper } from "./fetchwrapper";
import { User } from "./interfaces";

const userService = {
  get userId() {
    return localStorage.getItem("user"); // TODO maybe use cookies
  },
  login,
  logout,
  register,
  getById,
  getAll,
  createPost,
};

async function login(email: string, password: string) {
  return await fetchWrapper
    .post("/api/user/login", {
      email,
      password,
    })
    .then((u: User) => {
      // TODO set session cookie
      localStorage.setItem("User", String(u.id)); // TODO make a real connection token
      Router.push("/");
    });
}

function logout() {
  console.log("Loging out");
  localStorage.removeItem("user");
  Router.push("/login");
}

async function register(user: User) {
  return fetchWrapper.post(`api/user/register`, user).then((u) => {
    Router.push("/login");
    return u;
  });
}

async function getById(id: string | number) {
  return fetchWrapper.get(`api/user/${id}`);
}
async function getAll() {
  return fetchWrapper.get("api/user/all");
}

async function createPost(content: string, author?: string) {
  return fetchWrapper.post("api/post/create", {
    author: author ? Number(author) : userService.userId,
    content: content,
  });
}

export default userService;
