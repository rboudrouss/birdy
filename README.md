### Cachier des charges <!>

- [X] dans les profils afficher les followers, following
- [ ] Option de recherche par mot clé
  - [ ] peut-être passé sous postgresql/mysql du coup ? ou implémenter from scratch. see https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search
- [X] in home page, tage "Latest" (derniers message de tout birdy) et "following" ( dernier message des personnes que tu follows )
- [X] add expiration date coté serveur aux sessions (supprimer aussi la session en cas de logout (?))

### TODO list

- [X] FIX "bio is wrong type" when bio is empty
- [ ] Add bookmarks ?
- [X] Add Image store
- [X] Add real sessions, instead of only the ID
  - [X] remove the author in body in requests (i've done it anyway) 
- [X] Hash passwords
  - [ ] add salt
- [X] Write an OOP API like `new Post({id : 2}).fetchlikes()/.getlikes()`
- [ ] reformate the code in a oop way. seems like a mess, too much strugling between userService & APIwrapper.
  - [ ] rewrite the APIwrapper to correctly [wrap the prisma object](https://www.prisma.io/docs/concepts/components/prisma-client/custom-models)
- [X] standardiser les types de input & output des call api <!> (un peu le bordel, si c'est un string ou un nombre)
- [X] Pop-up for deleting
- [ ] Pop-up for login out
- [ ] Pop-up for login/register
- [X] find a solution for the "foreign key constraint failed on the field: `foreign key`" on delete
- [ ] FIX "API resolved without sending a response", nextjs doesn't like the decorator function ?
- [ ] Use Next Router to change pages. (it has some benefits instead of the native javascript one)
- [ ] mieux gérer les thread
  - [ ] afficher les réponses avec le head de thread
  - [ ] ajouter des boutons "afficher les réponses" ou "show thread" à la twitter
- [ ] ~~Use React context instead reading the session storage at all time~~
- [ ] ~~use Session storage for some session temporary informations like likes posts~~

# Projet WEB

birdy : a twitter clone (not really but hey)

contraintes : utiliser nextjs (une nouvelle framework) se limiter à React en frontend sans aucune autre libraire

## Lunch app

first install the dependencies using yarn (`yarn`) or npm (`npm i`).

Migrate the database using `npx prisma migrate dev --name init` then `npx prisma migrate deploy`

To lunch the app : `yarn start` or `npm run start`