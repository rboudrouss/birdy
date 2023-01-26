// TODO add relations
export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  bio?: String | null;
}

export interface Post {
  id: number;
  createdAt: Date;
  content: string;
  author: number;
}
