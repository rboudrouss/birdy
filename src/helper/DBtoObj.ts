import { User, Post, Follows, Likes } from "@prisma/client";
import { POSTAPI, USERAPI } from "./constants";

export interface UserWithoutPass {
  id: number;
  email: string;
  password: null;
  username: string;
  bio: string | null;
  Posts?: Post[];
  followers?: Follows[];
  following?: Follows[];
}

export function removePassw(u: User): UserWithoutPass {
  let out: any = { ...u };
  out.password = null;
  return out as UserWithoutPass;
}

export interface UserJson {
  id: number;
  email: string;
  username: string;
  bio: string | null;
  password: null | string;
  profileLink: string;
  apiLink: string;
  followApi: string;
  unfollowApi: string;
  posts: PostJson[] | null;
  likes: number[] | null;
}

export class UserObj {
  id: number;
  email: string;
  password: string | null;
  username: string;
  bio: string | null;
  posts: PostObj[] | null;
  likes: number[] | null;

  constructor(
    u: (User | UserWithoutPass | UserJson) & {
      posts?: Post[] | null;
      likes?: Likes[] | number[] | null;
    }
  ) {
    this.id = u.id;
    this.email = u.email;
    this.password = u.password;
    this.username = u.username;
    this.bio = u.bio ?? null;
    this.posts = u.posts?.map((post) => new PostObj(post)) ?? null;
    this.likes = u.likes?.map((like: any) => like.postId ?? like) ?? null;
  }

  public get profileLink(): string {
    return `/${this.id}`;
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

  public get json(): UserJson {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      bio: this.bio,
      followApi: this.followApi,
      email: this.email,
      unfollowApi: this.unfollowApi,
      apiLink: this.apiLink,
      profileLink: this.profileLink,
      posts: this.posts?.map((post) => post.json) ?? null,
      likes: this.likes,
    };
  }

  public clone() {
    return new UserObj(this.json);
  }
}

export interface PostJson {
  id: number;
  createdAt: Date;
  content: string;
  authorId: number;
  replyId: number | null;
  postLink: string;
  apiLink: string;
  likeApi: string;
  unlikeApi: string;
  author: UserJson | null;
  replies: PostJson[] | null;
}

export class PostObj {
  id: number;
  createdAt: Date;
  content: string;
  authorId: number;
  replyId: number | null;
  author: UserObj | null;
  replies: PostObj[] | null;

  constructor(
    p: (Post | PostJson) & { author?: User | null; replies?: Post[] | null }
  ) {
    this.id = p.id;
    this.createdAt = p.createdAt;
    this.content = p.content;
    this.authorId = p.authorId;
    this.replyId = p.replyId;
    this.author = (p.author && new UserObj(p.author)) ?? null;
    this.replies = p.replies?.map((reply) => new PostObj(reply)) ?? null;
  }

  public get postLink(): string {
    return `/post/${this.id}`;
  }

  public get apiLink(): string {
    return `${POSTAPI}/${this.id}`;
  }

  public get likeAPI(): string {
    return `${this.apiLink}/like`;
  }

  public get unlikeAPI(): string {
    return `${this.apiLink}/unlike`;
  }

  public get json(): PostJson {
    return {
      id: this.id,
      createdAt: this.createdAt,
      content: this.content,
      authorId: this.authorId,
      replyId: this.replyId,
      postLink: this.postLink,
      apiLink: this.apiLink,
      likeApi: this.likeAPI,
      unlikeApi: this.unlikeAPI,
      author: this.author?.json ?? null,
      replies: this.replies?.map((post) => post.json) ?? null,
    };
  }

  public clone() {
    // HACK any
    return new PostObj(this.json as any);
  }
}
