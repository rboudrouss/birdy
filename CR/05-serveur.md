# Coté Serveur dans `pages/api` (Nextjs)

Un peu comme le coté client, les urls des API du coté serveur sont définies par le chemin des fichiers à partir de `pages`. Par exemple le fichier `pages/api/user/login.ts` correspond à l'url `/api/user/login`. Les fichiers `index.ts` sont utilisés pour le root de l'url.

Tout les API retourne une réponse json avec le format suivant :

```typescript
{
  isError: boolean,
  status: number,
  message: string,
  data: "\<selon l'API\>",
}
```

Les types que vous verrez ci-dessous sont les équivallents json des tables de la base de données.

Nous décrirons après les types et les méthodes de requêtes dans la forme suivante : <`format de la requete`> `Method` <`type de data dans la réponse`>

## `image`

- `/api/image/index.ts`; url : `/api/image`

  - `GET`<`HTML`> : retourne de l'html, un form pour pouvoir poster une image (utilisé à des fins de débug seulement <!>)

  - <`FORMDATA/IMG`>`POST`<`string`> : permet de poster une image. Retourne un objet json avec l'url de l'image (qui est aussi son id). 
  Le body de la requête doit être un form-data avec un champ `image` qui contient l'image. 
  Nous vérifions les cookies pour savoir qui est l'auteur de l'image.

- `/api/image/all.ts`; url : `/api/image/all`

  - `GET`<`Image[]`> : retourne une liste de toute les images stocké et leur auteurs.

## `user`

- `/api/user/all.ts`; url : `/api/user/all`

  - `GET`<`User[]`> : retourne une liste de tout les utilisateurs.

- `/api/user/login.ts`; url : `/api/login`

  - `POST`<`{session: Session, user: User}`> : permet de se connecter. Retourne un objet json avec la session et l'utilisateur. Vérifie si le mot de passe correspond au hash stocké dans la base de donnée et créé une session si c'est le cas.

- `/api/user/register.ts`; url : `/api/register`

  - <`username, email, password, bio : string`>`POST`<`User`> : permet de s'enregistrer, retourne l'utilisateur créé.


- `/api/user/all.ts`; url : `/api/user/all`

  - `GET`<`User[]`> : retourne une liste de tout les utilisateurs.

- `/api/user/[id]/index.ts`; url : `/api/user/:id`

  - `GET`<`User`> : retourne l'utilisateur avec l'id `:id`.

  - <`username, email, password, bio : string`>`PUT`<`User`> : permet de modifier l'utilisateur avec l'id `:id`. Retourne l'utilisateur modifié.

  - `DELETE`<`User`> : permet de supprimer l'utilisateur avec l'id `:id`. Retourne l'utilisateur supprimé. (<!> pas encore implémenté)

- `/api/user/[id]/follow.ts`; url : `/api/user/:id/follow`

  - <`author:int`>`POST`<`Follow`> : permet de suivre l'utilisateur avec l'id `:id`. Retourne les id de l'utilisateur et de l'auteur.

- `/api/user/[id]/unfollow.ts`; url : `/api/user/:id/unfollow`

  - <`author:int`>`POST`<`Follow`> : permet de ne plus suivre l'utilisateur avec l'id `:id`. Retourne les id de l'utilisateur et de l'auteur.

- `/api/user/[id]/profile.ts`; url : `/api/user/:id/profile` (pas le meilleur nom)

  - <`FORMDATA/IMG`>`POST`<`string`> : Modifie l'image de profile de l'utilisateur avec l'id `:id`. Retourne l'id de l'image.

## `post`

- `/api/post/recent.ts`; url : `/api/post/all`

  - <`all, n, skip, replies, follow : QUERIES`>`GET`<`Post[]`> : retourne la liste des postes. Les paramètres sont optionnels et sont décrits dans le fichier `pages/api/post/recent.ts`.

- `/api/post/create.ts`; url : `/api/post/:id/create` (nous devrions regrouper ça dans le fichier `index.ts`)

  - <`author:int, content:string`>`POST``<`Post`> : permet de créer un nouveau post. Retourne le nouveau post créé.

- `/api/post/[id]/index.ts`; url : `/api/post/:id`

  - `GET`<`Post`> : retourne le post avec l'id `:id`.

- `/api/post/[id]/like.ts`; url : `/api/post/:id/like`

  -  <`author:int`>`POST`<`Like`> : permet de liker le post avec l'id `:id`. Retoune les deux id du post et de l'utilisateur.

- `/api/post/[id]/unlike.ts`; url : `/api/post/:id/unlike`

  - <`author:int`>`POST`<`Like`> : permet de ne plus liker le post avec l'id `:id`. Retoune les deux id du post et de l'utilisateur.

- `/api/post/[id]/reply.ts`; url : `/api/post/:id/reply` (nous devrions regrouper ça dans le fichier `index.ts`)

  - <`author:int, content:string`>`POST`<`Post`> : permet de répondre au post avec l'id `:id`. Retourne le nouveau post créé.

- `/api/post/[id]/delete.ts`; url : `/api/post/:id/delete` (nous devrions regrouper ça dans le fichier `index.ts`)

  - `DELETE`<`null`> : permet de supprimer le post avec l'id `:id`. Retourne null
