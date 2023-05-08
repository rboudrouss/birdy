import { Likes, Post, User } from "@prisma/client";
import Cookies from "js-cookie";
import { APILINK, OKApiResponse, POSTAPI, USERAPI } from "./constants";
import { APIUser, APIPost, UserWithoutPass } from "./APIwrapper";
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
  search,
};

async function search(searchText: string) {
  return await fetchWrapper
    .get<{ users: User[]; posts: Post[] }>(`${APILINK}/search?s=${searchText}`)
    .then((p) => {
      return {
        users: p.data.users.map((u) => new APIUser(u)),
        posts: p.data.posts.map((p) => new APIPost(p)),
      };
    });
}

function isPostLiked(postId: number) {
  const user = getConnectedUser();
  return user?.likes?.includes(postId) ?? false;
}

async function updateConnectedUser() {
  console.info("Updating connected user");
  if (!cookieWrapper.front.isConnected()) return;
  let user = getConnectedUser() as APIUser;
  localStorage.setItem(
    "User",
    JSON.stringify(
      (await fetchWrapper.get<UserWithoutPass>(user?.apiLink)).data
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
    .post<{ session: string; user: UserWithoutPass }>(`${USERAPI}/login`, {
      email,
      password,
    })
    .then((u) => {
      Cookies.set("session", u.data.session, {
        expires: new Date(Date.now() + cookieWrapper.COOKIE_TTL),
      });
      localStorage.setItem("User", JSON.stringify(u.data.user));
      console.info("Logged in !");
      window.location.href = "/";
    });
}

function logout() {
  console.info("Logging out");
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
    .post<Post>(`${POSTAPI}/create`, {
      author,
      content,
    })
    .then((p) => {
      window.location.href = `/post/${p.data.id}`;
    });
}

async function getRecentPosts(data?: {
  all?: boolean;
  n?: number;
  start?: number;
  follow?: boolean;
  replies?: boolean;
}): Promise<
  OKApiResponse<{
    start: number;
    end: number;
    n: number;
    data: (Post & { author: User })[];
  }>
> {
  const { all, n, start, follow, replies } = data ?? {};
  let url = "/api/post/recent?";
  if (all) url += "&all=true";
  if (n) url += `&n=${n}`;
  if (start) url += `&skip=${start}`;
  if (follow) url += `&follow=true`;
  if (replies) url += `&replies=true`;
  return fetchWrapper.get(url);
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
