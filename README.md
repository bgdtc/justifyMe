# Justify Me API

Ce projet est une API REST (typescript nodeJS) serverless fonctionnant avec AWS lambda et dynamoDB permettant de justifier du texte.
L'api est disponible à cette addresse : https://justifyme.dev.sartheemploi.fr/api
La documentation de cette API est disponible à cette addresse : https://bgdtc.github.io/justify-me-api-docs/

## Prérequis
0. nodejs,npm,yarn,make...
1. un compte AWS.
2. un compte terraform cloud avec un workspace.
3. un compte serverless.

## Installation

1. `git clone https://github.com/bgdtc/justifyMe.git`
2. `cd justify me && make`
3. Renommez "serverless-sample.yml" en "serverless.yml" et configurez le fichier avec vos informations.
4. Dans le dossier terraform/, modifiez les fichiers "db.tf", "env-config.tf" et "main.tf" avec vos informations.
5. `make tf-init && make tf-plan && make tf-apply` (création de la table dans dynamo avec les autorisations nécessaires, etc.)
6. `make start` (démarre le projet localement avec serverless offline)

## Utilisation

Un fichier **insomnia.yml** est disponible dans le repo, il contient un workspace insomnia préconfiguré avec des exemples de requêtes. Cependant, une documentation openapi est disponible à cette adresse : https://bgdtc.github.io/justify-me-api-docs/

## Déploiement

1. `make tf-init && make tf-plan && make tf-apply` (création de la table dans dynamo avec les autorisations nécessaires, etc.)
2. `make refresh` (déploiement de la lambda sur AWS via serverless)

## Routes

- **POST** `/api/tokens` : génère un token JWT pour un utilisateur avec une adresse e-mail valide.
- **POST** `/api/justify` : justifie le texte en entrée en respectant une largeur de ligne spécifique.

## Configuration

Les variables d'environnement suivantes sont utilisées pour configurer l'application :

- **TOKENS_RATE_LIMIT_TIMEOUT** : durée en ms pendant laquelle le quota de mots est appliqué (par défaut : 86400000 ms, soit 24 heures).
- **TOKENS_MAX_REQUEST** : nombre maximal de requêtes autorisées pour une période de TOKENS_RATE_LIMIT_TIMEOUT (par défaut : 1).
- **JUSTIFY_WORD_LIMIT** : nombre maximal de mots pouvant être justifiés pendant une période de TOKENS_RATE_LIMIT_TIMEOUT (par défaut : 80000 mots).
- **JWT_SECRET** : clé secrète utilisée pour signer les tokens JWT (remplacez "your_jwt_secret" par votre propre clé secrète).
- **DYNAMODB_TABLE_NAME** : nom de la table DynamoDB utilisée pour stocker les informations de quota (par défaut : "TokensRateLimit")

## Tests

Tests unitaires & d'intégration réalisés avec jest/ts-jest
Coverage 100%

![alt text](https://github.com/bgdtc/justifyMe/blob/coverage/coverage.png)
