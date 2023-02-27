// HACK all this file is ugly, there is probably a better way for all of this ?
// NOTE this file is meant to be use in the fronted only <!>
import { User, Post, postImages } from "@prisma/client";
import { APILINK, POSTAPI } from "../constants";
import { fetchWrapper } from "../fetchwrapper";
import { APIUser } from "./APIUser";

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
    return this.images.map((i) => `${APILINK}/image/${i}`);
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

    return this;
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
