\tableofcontents

# Introduction

Ce projet est un projet universitaire qui a pour but de créer un site web comparable à [Twitter](https://twitter.com/). Ce projet est réalisé dans le cadre de l'UE technologie du web (LU3IN017) à Sorbonne Université.

Une version en ligne est disponible à l'adresse suivante : [https://birdy.rboud.com](https://birdy.rboud.com).

# Outils utilisés

Ce projet est réalisé avec les frameworks et outils suivants :

- [Typescript](https://www.typescriptlang.org/) pour le développement. Typescript est équivalent au Javascript mais avec des types statiques. Cela permet de développer plus rapidement et de trouver plus facilement les erreurs.

- [React](https://reactjs.org/) pour la création de l'interface utilisateur coté client.

- [Next.js](https://nextjs.org/) pour la gestion de la backend et de la génération du site web. Nextjs offre la possibilité aussi de prégénérer certain composant coté serveur pour améliorer les performances. Il s'occupe aussi du routing et de la génération des pages.

- [Prisma](https://www.prisma.io/) pour la gestion de la base de données. Prisma est un ORM qui permet de gérer la base de données, ses migrations, ses requêtes et est particulièrment adapté au Typescript car il permet de faciliter le typage.

# Structure générale du projet

Au root du projet vous trouverez plusieurs dossiers _(ignorons les fichiers de configuration)_ :

- `src` : contient le code source du projet

- `public` : contient les fichiers statiques du projet

- `prisma` : contient les fichiers de configuration de la base de données (et la base de données si sqlite est utilisé). Le fichier `schema.prisma` contient la définition de la base de données.

Concernant le dossier `src` il contient plusieurs sous-dossiers :

- `app` : contient le coté ""client"" de l'application, toutes les pages et composants sont dans ce dossier.

- `pages/api` : contient le coté serveur et plus précisément l'API.

- `helper` : contient toutes fonctions utilitaires.
