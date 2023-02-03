import { Post, User } from "@prisma/client";
import { ApiResponse } from "./constants";
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
};

async function login(email: string, password: string): Promise<void> {
  return await fetchWrapper
    .post("/api/user/login", {
      email,
      password,
    })
    .then((u: User) => {
      // TODO set session cookie
      localStorage.setItem("User", String(u.id)); // TODO make a real connection token
      console.log("Logged in !");
      window.location.href = "/";
    });
}

function logout() {
  console.log("Loging out");
  localStorage.removeItem("user");
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

async function getById(id: string | number): Promise<ApiResponse<User>> {
  return fetchWrapper.get(`/api/user/${id}`);
}
async function getAll(): Promise<ApiResponse<User[]>> {
  return fetchWrapper.get("/api/user/all");
}

async function createPost(content: string, author?: string): Promise<void> {
  return fetchWrapper
    .post("/api/post/create", {
      author: author ? Number(author) : userService.userId,
      content: content,
    })
    .then((p: ApiResponse<Post>) => {
      window.location.href = `/post/${p?.data?.id}`;
    });
}

async function getRecentPosts(
  n?: number,
  start?: number
): Promise<
  ApiResponse<{
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

export default userService;
