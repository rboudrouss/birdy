import { Likes, Post, User } from "@prisma/client";
import Cookies from "js-cookie";
import { ApiResponse, OKApiResponse } from "./constants";
import { APIUser, UserWithoutPass } from "./APIwrapper";
import { fetchWrapper } from "./fetchwrapper";

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
  getRecentPosts,
  getPostById,
};

async function login(email: string, password: string): Promise<void> {
  return await fetchWrapper
    .post<{ session: string; user: UserWithoutPass }>("/api/user/login", {
      email,
      password,
    })
    .then((u) => {
      // TODO set session cookie
      Cookies.set("session", u.data.session, { expires: 7 });
      localStorage.setItem(
        "User",
        JSON.stringify(new APIUser(u.data.user as UserWithoutPass))
      ); // TODO make a real connection token
      console.log("Logged in !");
      window.location.href = "/";
    });
}

function logout() {
  console.log("Loging out");
  Cookies.remove("session");
  localStorage.removeItem("User");
  window.location.href = "/login";
}

async function register(user: {
  email: string;
  password: string;
  username: string;
  bio?: string;
}): Promise<void> {
  return fetchWrapper.post(`/api/user/register`, user).then(() => {
    window.location.href = "/login";
  });
}

async function getById(id: string | number): Promise<OKApiResponse<User>> {
  return fetchWrapper.get(`/api/user/${id}`);
}
async function getAll(): Promise<OKApiResponse<User[]>> {
  return fetchWrapper.get("/api/user/all");
}

async function createPost(content: string, author?: string): Promise<void> {
  return fetchWrapper
    .post<Post>("/api/post/create", {
      author: author ? Number(author) : userService.userId,
      content: content,
    })
    .then((p) => {
      window.location.href = `/post/${p.data.id}`;
    });
}

async function getRecentPosts(
  n?: number,
  start?: number
): Promise<
  OKApiResponse<{
    start: number;
    end: number;
    n: number;
    data: (Post & { author: User })[];
  }>
> {
  return fetchWrapper.get(
    `/api/post/recent?${n ? `n=${n}}` : ""}${start ? `start=${start}` : ""}`
  );
}

async function getPostById(id: number): Promise<
  OKApiResponse<
    Post & {
      author: User;
      likes: Likes[];
      replies: Post[];
      replyTo: Post | null;
    }
  >
> {
  return fetchWrapper.get(`/api/post/${id}`);
}

export default userService;
