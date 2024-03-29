// HACK all this file is ugly, there is probably a better way for all of this ?
// NOTE this file is meant to be use in the fronted only <!>
import {
  User,
  Post,
  Likes,
  Image,
  postImages,
  coverImage,
  ppImage,
  Follows,
} from "@prisma/client";
import { defaultAvatarUrl, USERAPI } from "../constants";
import { fetchWrapper } from "../fetchwrapper";
import { APIPost } from "./APIPost";

export type UserWithoutPass = User & { password?: string | null };

export function removePassw(u: User): UserWithoutPass {
  let { password, ...out } = u;
  (out as any).password = null;
  return out as UserWithoutPass;
}

export class APIUser {
  id: number;
  email: string;
  password: string | null;
  username: string;
  bio: string | null;
  posts: APIPost[];
  likes: number[];
  nbFollowers: number;
  nbFollowing: number;
  nbLikes: number;
  images: string[];
  postsImages: string[];
  ppImage?: string;
  coverImage?: string;
  followers: number[];
  following: number[];
  followingUsers: APIUser[];
  followerUsers: APIUser[];
  likedPosts: APIPost[];

  constructor(
    u: (User | UserWithoutPass | APIUser) & {
      posts?: Post[] | null;
      likes?: Likes[] | number[] | null;
      images?: Image[] | string[] | null;
      postsImages?: postImages[] | string[] | null;
      ppImage?: ppImage | string | null;
      coverImage?: coverImage | string | null;
      followers?: Follows[] | number[] | null;
      following?: Follows[] | number[] | null;
      followingUsers?: APIUser[] | null;
      followerUsers?: APIUser[] | null;
      likedPosts?: APIPost[] | null;
    }
  ) {
    this.id = u.id;
    this.email = u.email;
    this.password = u.password;
    this.username = u.username;
    this.bio = u.bio ?? null;
    this.likes = u.likes?.map((like: any) => like.postId ?? like) ?? [];
    this.nbFollowers = u.nbFollowers;
    this.nbFollowing = u.nbFollowing;
    this.nbLikes = u.nbLikes;
    this.images = u.images?.map((i: any) => i.id ?? i) ?? [];
    this.postsImages = u.postsImages?.map((i: any) => i.imageId ?? i) ?? [];
    this.ppImage = (u.ppImage as any)?.imageId ?? u.ppImage ?? null;
    this.coverImage = (u.coverImage as any)?.imageid ?? u.coverImage ?? null;
    this.followers = u.followers?.map((f: any) => f.followerId ?? f) ?? [];
    this.following = u.following?.map((f: any) => f.followingId ?? f) ?? [];
    this.followingUsers =
      u.followingUsers ??
      u.following?.map((f: any) => f.following && new APIUser(f.following)).filter((a) => a) ??
      [];
    this.followerUsers =
      u.followerUsers ??
      u.followers?.map((f: any) => f.follower && new APIUser(f.follower)).filter((a) => a) ??
      [];
    // HACK any cause if there isn't u.likedPosts then it's already a Likes[]
    this.likedPosts = u.likedPosts ?? u.likes?.map((likes: any) => likes.post && new APIPost(likes.post)) ?? [];

    this.posts =
      u.posts
        ?.map((post) => new APIPost(post))
        .map((post) => {
          post.author = this;
          return post;
        }) ?? [];
    if (
      [
        this.id,
        ...(this.likes ?? []),
        this.nbFollowers,
        this.nbFollowing,
        this.nbLikes,
      ].some((e) => isNaN(e) || !Number.isInteger(e))
    )
      console.error("Got a NaN or not a number in APIUser declaration");
  }

  public get profileLink(): string {
    return `/profile/${this.id}`;
  }

  public get apiLink(): string {
    return `${USERAPI}/${this.id}`;
  }

  public get followApi(): string {
    return `${this.apiLink}/follow`;
  }

  public get unfollowApi(): string {
    return `${this.apiLink}/unfollow`;
  }

  public get avatarImg(): string {
    return this.ppImage ? `/uploads/${this.ppImage}` : defaultAvatarUrl;
  }

  // TODO find a default cover image
  public get coverImg(): string {
    return this.coverImage ? `/uploads/${this.coverImage}` : defaultAvatarUrl;
  }

  public clone() {
    return new APIUser(this as any);
  }

  public async follow(author: number) {
    if (isNaN(author) || author < 1)
      throw new Error(
        `APIUser.follow: got a NaN author or invalid (author=${author})`
      );
    return await fetchWrapper.post(this.followApi, { author });
  }

  public async unfollow(author: number) {
    if (isNaN(author) || author < 1)
      throw new Error(
        `APIUser.unfollow: got a NaN author or invalid (author=${author})`
      );
    return await fetchWrapper.post(this.unfollowApi, { author });
  }

  static async fetch(id: number, replies?: boolean, likes?: boolean) {
    if (isNaN(id) || id < 1)
      throw new Error(`APIUser.fetch: got a NaN id or invalid (id=${id})`);
    return new APIUser(
      await fetchWrapper
        .get<User>(
          `${USERAPI}/${id}?${replies ? "replies=true" : ""}${
            likes ? "&likes=true" : ""
          }`
        )
        .then((u) => u.data)
    );
  }

  public async updateThis() {
    let u = new APIUser(
      await fetchWrapper.get<User>(this.apiLink).then((u) => u.data)
    );
    this.id = u.id;
    this.email = u.email;
    this.password = u.password;
    this.username = u.username;
    this.bio = u.bio;
    this.posts = u.posts;
    this.likes = u.likes;
    this.nbFollowers = u.nbFollowers;
    this.nbFollowing = u.nbFollowing;
    this.nbLikes = u.nbLikes;
    this.images = u.images;
    this.postsImages = u.postsImages;
    this.ppImage = u.ppImage;
    this.coverImage = u.coverImage;

    return this;
  }

  // Deprecated
  public async update() {
    const { email, username, bio, password } = this;

    let data = password
      ? { email, username, bio, password }
      : { email, username, bio };

    return new APIUser(
      await fetchWrapper.put<User>(this.apiLink, data).then((u) => u.data)
    );
  }
}
