// TODO add relations
export interface User {
  id?: number;
  email: string;
  password?: string;
  username: string;
  bio?: String | null;
}

export interface Post {
  id: number;
  createdAt: Date;
  content: string;
  author: number;
}
