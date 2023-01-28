import Router from "next/router";
import { fetchWrapper } from "./fetchwrapper";
import { User } from "./interfaces";

const userService = {
  login,
  logout,
  register,
  getById,
  getAll,
};

async function login(email: string, password: string) {
  return await fetchWrapper
    .post("/api/user/login", {
      email,
      password,
    })
    .then((u: User) => {
      localStorage.setItem("User", String(u.id)); // TODO make a real connection token
      return u;
    });
}

function logout() {
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

export default userService;
