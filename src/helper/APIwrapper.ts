// HACK all this file is ugly, there is probably a better way for all of this ?
import { User, Post, Likes } from "@prisma/client";
import { POSTAPI, USERAPI } from "./constants";
import { fetchWrapper } from "./fetchwrapper";

export type UserWithoutPass = User & { password?: string | null };

export function removePassw(u: User): UserWithoutPass {
  let out: any = { ...u };
  out.password = null;
  return out as UserWithoutPass;
}

export class APIUser {
  id: number;
  email: string;
  password: string | null;
  username: string;
  bio: string | null;
  posts: APIPost[] | null;
  likes: number[] | null;
  nbFollowers: number;
  nbFollowing: number;
  nbLikes: number;

  constructor(
    u: (User | UserWithoutPass) & {
      posts?: Post[] | null;
      likes?: Likes[] | number[] | null;
    }
  ) {
    this.id = u.id;
    this.email = u.email;
    this.password = u.password;
    this.username = u.username;
    this.bio = u.bio ?? null;
    this.posts = u.posts?.map((post) => new APIPost(post)) ?? null;
    this.likes = u.likes?.map((like: any) => like.postId ?? like) ?? null;
    this.nbFollowers = u.nbFollowers;
    this.nbFollowing = u.nbFollowing;
    this.nbLikes = u.nbLikes;
    if (
      [
        this.id,
        ...(this.likes ?? []),
        this.nbFollowers,
        this.nbFollowing,
        this.nbLikes,
      ].some((e) => isNaN(e) || !Number.isInteger(e))
    )
      throw new Error("Got a NaN or not a number in APIUser declaration");
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

  static async fetch(id: number) {
    if (isNaN(id) || id < 1)
      throw new Error(`APIUser.fetch: got a NaN id or invalid (id=${id})`);
    return new APIUser(
      await fetchWrapper.get<User>(`${USERAPI}/${id}`).then((u) => u.data)
    );
  }

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

export class APIPost {
  id: number;
  createdAt: Date;
  content: string;
  authorId: number;
  replyId: number | null;
  author: APIUser | null;
  replies: APIPost[] | null;
  nbLikes: number;
  nbReplies: number;

  constructor(p: Post & { author?: User | null; replies?: Post[] | null }) {
    this.id = p.id;
    this.createdAt = p.createdAt;
    this.content = p.content;
    this.authorId = p.authorId;
    this.replyId = p.replyId;
    this.author = (p.author && new APIUser(p.author)) ?? null;
    this.replies = p.replies?.map((reply) => new APIPost(reply)) ?? null;
    this.nbLikes = p.nbLikes;
    this.nbReplies = p.nbReplies;
    if (
      [this.id, this.replyId ?? 0, this.nbLikes, this.nbReplies].some(
        (e) => isNaN(e) || !Number.isInteger(e)
      )
    )
      throw new Error(
        "APIPost.constructor: got an invalid number in APIPost initialisation"
      );
  }

  public get postLink(): string {
    return `/post/${this.id}`;
  }

  public get apiLink(): string {
    return `${POSTAPI}/${this.id}`;
  }

  public get replyApi(): string {
    return `${this.apiLink}/reply`;
  }

  public get likeAPI(): string {
    return `${this.apiLink}/like`;
  }

  public get unlikeAPI(): string {
    return `${this.apiLink}/unlike`;
  }

  public async like(author: number) {
    if (isNaN(author) || author < 1)
      throw new Error(
        `APIPost.like: got a NaN author or invalid (author=${author})`
      );
    return await fetchWrapper.post(this.likeAPI, { author });
  }

  public async dislike(author: number) {
    if (isNaN(author) || author < 1)
      throw new Error(
        `APIPost.dislike: got a NaN author or invalid (author=${author})`
      );
    return await fetchWrapper.post(this.unlikeAPI, { author });
  }

  public get isReply(): boolean {
    return this.replyId !== null;
  }

  public get isRoot(): boolean {
    return !this.isReply;
  }

  public async reply(content: string, author: number) {
    if (isNaN(author) || author < 1)
      throw new Error(
        `APIPost.reply: got a NaN author or invalid (author=${author})`
      );
    if (content.length<1)
      throw new Error(
        "APIPost.reply: got empty content"
      );

    return await fetchWrapper.post(this.replyApi, { content, author });
  }

  public clone() {
    // HACK any
    return new APIPost(this as any);
  }

  static async fetch(id: number) {
    if (isNaN(id) || id < 1)
      throw new Error(`APIPost.fetch: got a NaN id or invalid (id=${id})`);
    return new APIPost(
      await fetchWrapper.get<Post>(`${POSTAPI}/${id}`).then((p) => p.data)
    );
  }
}
