# Base de donnée et tables

En développement, nous utilisons une base de donnée sqlite. Pour la production, nous utilisons une base de donnée postgresql. Pour la gestion de la base de donnée, nous utilisons prisma qui fait les migrations et les requêtes pour nous.

## Table

Notre table est décrite dans le fichier `schema.prisma` qui se trouve dans le dossier `prisma`. N'hésitez pas à regarder le fichier pour plus de détails.

### User

La table User contient les informations de l'utilisateur.

Le mot de passe est stocké en hash avec bcrypt. Nous n'utilisons pas de salt pour l'instant, c'est un ajout que l'on compte faire.

| id  | username | email  | password | bio    | createdAt | nbFollowers | nbFollowing | nbLikes |
| --- | -------- | ------ | -------- | ------ | --------- | ----------- | ----------- | ------- |
| int | string   | string | string   | string | date      | int         | int         | int     |

### Post

La table Post contient les informations d'un post, que ça soit un post normal ou une réponse.

| id  | content | createdAt | authorId | replyId | nbLikes | nbReplies |
| --- | ------- | --------- | -------- | ------- | ------- | --------- |
| int | string  | date      | int      | ?int    | int     | int       |

### Likes

La table Likes contient les informations d'un like, c'est une association entre un utilisateur et un post.

| createdAt | userId | postId |
| --------- | ------ | ------ |
| date      | int    | int    |

### Follows

La table Follows contient les informations d'un follow, c'est une association entre un utilisateur et un autre utilisateur.

| createdAt | followerId | followingId |
| --------- | ---------- | ----------- |
| date      | int        | int         |

### Session

La table Session contient les informations d'une session. Une session est un token généré qui permet de s'authentifier sur le site. Il a une date d'expiration et un utilisateur peut en avoir plusieurs.

| id     | createdAt | expires | userId |
| ------ | --------- | ------- | ------ |
| string | date      | date    | int    |

### Image

La table Image contient les informations d'une image. Une image est un fichier qui est stocké sur le serveur et qui est associé à un utilisateur.

Nous différencions après les images de profil et les images de post dans une autre table. 
Les images sont stockés dans le dossier `public/uploads` et sont donc accésible via l'url `/uploads/<imageId>`.

| id     | createdAt | userId |
| ------ | --------- | ------ |
| string | date      | int    |

#### postImage

La table postImage est une association entre une Image et un Post.

| postId | imageId | userId |
| ------ | ------- | ------ |
| int    | string  | int    |

#### ppImage

De même, une association entre une Image et un User.

| userId | imageId |
| ------ | ------- |
| int    | string  |
