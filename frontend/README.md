# SleepBetter - Application Frontend de Suivi du Sommeil

## Structure du Projet

Projet frontend Next.js avec Docker, sans backend :

```
sleep-app/
├── Dockerfile              # Configuration Docker pour le frontend
├── docker-compose.yml      # Configuration Docker Compose (frontend uniquement)
├── .dockerignore          # Fichiers ignorés par Docker
├── package.json           # Dépendances Node.js
├── next.config.mjs        # Configuration Next.js
├── app/                   # Dossier App Router Next.js
├── public/                # Fichiers statiques (logos, etc.)
├── components/            # Composants React
└── README.md              # Ce fichier
```

## Démarrage avec Docker

### Prérequis
- Docker installé sur votre machine
- Docker Compose installé

### Lancement de l'application

1. **Construire et démarrer les conteneurs :**
   ```bash
   docker-compose up --build
   ```

2. **Accéder à l'application :**
   - Frontend : http://localhost:3000

3. **Arrêter les conteneurs :**
   ```bash
   docker-compose down
   ```

### Développement

- Le code est monté en volume pour le hot-reload
- Les modifications sont automatiquement appliquées
- Les logs sont visibles avec `docker-compose logs -f`

## Variables d'Environnement

- `NEXT_PUBLIC_API_URL` : URL de l'API backend (si connexion externe)
- `CHOKIDAR_USEPOLLING` : Active la détection des changements de fichiers

## Notes

- Ce projet ne contient que le frontend
- Pas de base de données incluse (frontend uniquement)
- Peut se connecter à une API externe si nécessaire
