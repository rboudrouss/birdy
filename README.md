- [ ] Add bookmarks ?
- [X] Add Image store
- [X] Add real sessions, instead of only the ID
  - [X] remove the author in body in requests (meh don't think i'll do that, the double verification is cool)
- [X] Hash passwords
  - [ ] add salt
- [X] Write an OOP API like `new Post({id : 2}).fetchlikes()/.getlikes()`
- [ ] reformate the code in a oop way. seems like a mess, too much strugling between userService & APIwrapper.
  - [ ] rewrite the APIwrapper to correctly [wrap the prisma object](https://www.prisma.io/docs/concepts/components/prisma-client/custom-models)
- [X] standardiser les types de input & output des call api <!> (un peu le bordel, si c'est un string ou un nombre)
- [ ] Pop-up for deleting/login out
- [X] find a solution for the "foreign key constraint failed on the field: `foreign key`" on delete
- [ ] FIX "API resolved without sending a response", nextjs doesn't like the decorator function ?
- [ ] Use Next Router to change pages. (it has some benefits instead of the native javascript one)
- [ ] ~~Use React context instead reading the session storage at all time~~
- [ ] ~~use Session storage for some session temporary informations like likes posts~~

# Projet WEB

birdy : a twitter clone (not really but hey)


## Lunch app

first install the dependencies using yarn (`yarn`) or npm (`npm i`).

Migrate the database using `npx prisma migrate dev --name init` then `npx prisma migrate deploy`

To lunch the app : `yarn start` or `npm run start`