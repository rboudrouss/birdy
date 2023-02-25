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
} from "@prisma/client";
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
  images: string[];
  postsImages: string[];
  ppImage?: string;
  coverImage?: string;

  constructor(
    u: (User | UserWithoutPass) & {
      posts?: Post[] | null;
      likes?: Likes[] | number[] | null;
      images?: Image[] | string[] | null;
      postsImages?: postImages[] | string[] | null;
      ppImage?: ppImage | string | null;
      coverImage?: coverImage | string | null;
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
    this.images = u.images?.map((i: any) => i.id ?? i) ?? [];
    this.postsImages = u.postsImages?.map((i: any) => i.imageId ?? i) ?? [];
    this.ppImage = (u.ppImage as any)?.imageId ?? u.ppImage ?? null;
    this.coverImage = (u.coverImage as any)?.imageid ?? u.coverImage ?? null;
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

  public get avatarImg(): string {
    return `${this.apiLink}/pp`;
  }

  // TODO
  public get coverImg(): string {
    return "";
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
  replyTo: APIPost | null;
  images: string[];

  constructor(
    p: Post & {
      author?: User | null;
      replies?: Post[] | null;
      replyTo?: Post | null;
      images?: postImages[] | string[] | null;
    }
  ) {
    this.id = p.id;
    this.createdAt = p.createdAt;
    this.content = p.content;
    this.authorId = p.authorId;
    this.replyId = p.replyId;
    this.author = (p.author && new APIUser(p.author)) ?? null;
    this.replies = p.replies?.map((reply) => new APIPost(reply)) ?? null;
    this.nbLikes = p.nbLikes;
    this.nbReplies = p.nbReplies;
    this.images = p.images?.map((i: any) => i.imageId ?? i) ?? [];
    if (
      [this.id, this.replyId ?? 0, this.nbLikes, this.nbReplies].some(
        (e) => isNaN(e) || !Number.isInteger(e)
      )
    )
      throw new Error(
        "APIPost.constructor: got an invalid number in APIPost initialisation"
      );
    this.replyTo = p.replyTo ? new APIPost(p.replyTo) : null;
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

  public get deleteAPI(): string {
    return `${this.apiLink}/delete`;
  }

  public get imageLinks(): string[] {
    return this.images.map((i) => `${POSTAPI}/image/${i}`);
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
    return await fetchWrapper.post(this.unlikeAPI, {
      author,
    });
  }

  public async delete() {
    await fetchWrapper.delete(this.deleteAPI);
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
    if (content.length < 1) throw new Error("APIPost.reply: got empty content");

    return new APIPost(
      (
        await fetchWrapper.post<Post>(this.replyApi, {
          content,
          author,
        })
      ).data
    );
  }

  public async updateThis() {
    let p = new APIPost(
      await fetchWrapper.get<Post>(`${POSTAPI}/${this.id}`).then((p) => p.data)
    );

    this.id = p.id;
    this.createdAt = p.createdAt;
    this.content = p.content;
    this.authorId = p.authorId;
    this.replyId = p.replyId;
    this.author = p.author;
    this.replies = p.replies;
    this.nbLikes = p.nbLikes;
    this.nbReplies = p.nbReplies;
    this.images = p.images;
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
