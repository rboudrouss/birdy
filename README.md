- [ ] Add bookmarks ?
- [ ] Add Image store, Cloudinary ?
- [ ] Add real sessions, instead of only the ID
- [ ] Hash passwords


# Projet WEB

birdy : a twitter clone (not really but hey)

# Interface (datatypes)

```ts
User = {
  id?: number;
  email: string;
  password?: string;
  username: string;
  bio?: String | null;
  posts?: Post[];
  followers?: User[];
  following?: User[];
}

Post = {
  id: number;
  createdAt: Date;
  content: string;
  author: number;
}
```

check `src/helper/interface.ts` for more details on datastructure. And `prisma/schema.prisma` for details on the Database structure.

# API

- `api/`  
    - `api/status`  
        request :  
            method : ALL  
        reponse :  
            body : json `{status : "Ok o/}`  

    - `api/user`  
        - `api/user/register`  
            creates a new user, doesn't log them in  
            request :  
                method : POST  
                body : json `{password:string, email:string, username:string, bio?:string}`  
            response :
                body : json `User` 
        - `api/user/login`  
            logs user  
                request:  
                    method: POST  
                    body: json `{email:string, password:string}`  
                response:  
                    body : json `User & {msg : string}`  
        - `api/user/delete`  
            delete user  
            TODO  
        - `api/user/all`  
            gets all users (for dev only)  
            request:  
                method : GET  
            response:  
                body : json `User[]`  
        - `api/user/:id`  
            get all data from user or edit it  
            request 1:  
                method : GET  
            reponse 1:  
                body : json `User`  

            request 2:  
                method : PUT  
                Cookies : TODO <!>
                body : json `Partial<User>`  
            response 2:  
                body: json `User`  
        - `api/user/:id/follow`  
            follows User \<id\>  
            request:  
                method : POST  
                Cookies : TODO <!>
                body : json `{user : number}` (user is author ID)  
            response:  
                body: json `{followingId:number, followerId: number}`  
        - `api/user/:id/unfollow`  
            unfollows User \<id\>  
            request:  
                method : POST  
                Cookies : TODO <!>
                body : json `{user : number}` (user is author ID)  
            response:  
                body: json `{followingId:number, followerId: number}`  
    
    - `api/post`  
    TODO


