# Backend — Restaurant Management API

Ce dossier est prêt pour accueillir votre API backend.

## Architecture Suggérée

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        ← Connexion MongoDB
│   │   └── env.js             ← Variables d'environnement
│   ├── middleware/
│   │   ├── auth.js            ← JWT middleware
│   │   ├── roleGuard.js       ← Vérification des rôles
│   │   └── errorHandler.js    ← Gestion erreurs globale
│   ├── models/
│   │   ├── User.js            ← Modèle utilisateur (client/restaurant/superadmin)
│   │   ├── Restaurant.js      ← Modèle restaurant
│   │   ├── Menu.js            ← Modèle menu/plats
│   │   ├── Order.js           ← Modèle commande
│   │   ├── Table.js           ← Modèle table/réservation
│   │   └── Review.js          ← Modèle avis
│   ├── routes/
│   │   ├── auth.routes.js     ← /api/auth/login, /register
│   │   ├── superadmin.routes.js
│   │   ├── restaurant.routes.js
│   │   └── client.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── superadmin.controller.js
│   │   ├── restaurant.controller.js
│   │   └── client.controller.js
│   ├── services/
│   │   ├── emailService.js    ← Notifications email
│   │   └── uploadService.js   ← Upload images (Cloudinary)
│   └── app.js                 ← Express app setup
├── server.js                  ← Point d'entrée
├── .env.example               ← Template variables env
└── package.json
```

## Stack Recommandée

| Technologie | Usage |
|------------|-------|
| Node.js + Express | API REST |
| MongoDB + Mongoose | Base de données |
| JWT | Authentification |
| Bcrypt | Hashage mots de passe |
| Cloudinary | Stockage images |
| Nodemailer | Emails transactionnels |
| Socket.io | Mises à jour temps réel (commandes) |

## Endpoints Principaux

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh-token`

### SuperAdmin
- `GET  /api/admin/dashboard`
- `GET  /api/admin/restaurants`
- `POST /api/admin/restaurants`
- `PUT  /api/admin/restaurants/:id`
- `DELETE /api/admin/restaurants/:id`
- `GET  /api/admin/users`

### Restaurant
- `GET  /api/restaurant/dashboard`
- `GET  /api/restaurant/menu`
- `POST /api/restaurant/menu`
- `GET  /api/restaurant/orders`
- `PUT  /api/restaurant/orders/:id/status`
- `GET  /api/restaurant/tables`

### Client
- `GET  /api/restaurants`
- `GET  /api/restaurants/:id`
- `POST /api/orders`
- `GET  /api/orders/my`
- `POST /api/reservations`

## Démarrage Rapide

```bash
npm init -y
npm install express mongoose jsonwebtoken bcryptjs dotenv cors
npm install -D nodemon
```

Créer `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```
