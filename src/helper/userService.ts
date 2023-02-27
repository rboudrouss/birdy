import { Likes, Post, User } from "@prisma/client";
import Cookies from "js-cookie";
import { OKApiResponse } from "./constants";
import { APIUser, UserWithoutPass } from "./APIwrapper";
import { fetchWrapper } from "./fetchwrapper";
import cookieWrapper from "./cookiewrapper";

const userService = {
  get userId() {
    return getConnectedUser()?.id ?? null;
  },
  login,
  logout,
  register,
  createPost,
  getRecentPosts,
  getPostById,
  getConnectedUser,
  updateConnectedUser,
  isPostLiked,
};

function isPostLiked(postId: number) {
  const user = getConnectedUser();
  return user?.likes?.includes(postId) ?? false;
}

async function updateConnectedUser() {
  console.log("Updating connected user");
  if (!cookieWrapper.front.isConnected()) return;
  let user = getConnectedUser() as APIUser;
  localStorage.setItem(
    "User",
    JSON.stringify(
      new APIUser((await fetchWrapper.get<UserWithoutPass>(user?.apiLink)).data)
    )
  );
}

function getConnectedUser(): APIUser | null {
  if (!cookieWrapper.front.isConnected()) return null;
  const user = localStorage.getItem("User");

  if (!user) {
    // Error, login out
    // logout();
    // throw new Error("Cookie is set but no user is found in local storage");
    return null;
  }
  let out;

  try {
    out = new APIUser(JSON.parse(user));
  } catch (e: any) {
    alert("Error while parsing user, logging out");
    logout();
    return null;
  }

  return out;
}

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

async function createPost(content: string, author: number): Promise<void> {
  return fetchWrapper
    .post<Post>("/api/post/create", {
      author,
      content,
    })
    .then((p) => {
      window.location.href = `/post/${p.data.id}`;
    });
}

async function getRecentPosts(
  all: boolean,
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
  if (all) return fetchWrapper.get(`/api/post/recent?all=true`);

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
