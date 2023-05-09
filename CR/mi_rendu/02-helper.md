# le dossier Helper

Ce dossier inclut plusieurs fichiers et fonctions utilitaires utilisés dans le projet (nous ne rentrerons pas dans les détails des fonctions).

- `constants.ts` : contient les constantes utilisées dans le projet (certaines peuvent être modifiées).

- `fetchWrapper.ts` : contient les fonctions qui englobe la fonction `fetch` par défaut de javascript. Ces fonctions permettent de simplifier l'utilisation de `fetch` et de gérer les erreurs.

- `userService.ts` : contient les fonctions utilisées pour les services de l'utilisateur (login, logout, register, création de post, etc...).

- `APIwrapper.ts` : contient les objets principaux utilisés pour communiquer avec l'API. Une classe `APIUser` et `APIPost` qui servent à la fois d'object contenant des informations que des fonctions pour communiquer avec l'API.

- `backendHelper.ts` : contient des fonctions utilisées et conçu pour être utilisé en backend.

- `ImageHelper.ts` : contient des fonctions utilisées pour gérer les images.

- `cookieHelper.ts` : contient des fonctions utilisées pour gérer les cookies.
