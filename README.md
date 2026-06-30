# TPFinal — Desarrollo de Software 2026

## Requisitos
- Node.js 18+
- npm

## Ejecutar el backend

```bash
cd back
npm install
npm run start:dev
```

El servidor queda en `http://localhost:3000`.

## Resetear usuarios de prueba

Crea/restaura `admin@test.com` y `user@test.com` en la base de datos:

```bash
cd back
node reset-users.js
```

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@test.com | Admin1234! | admin |
| user@test.com  | User1234!  | user  |

Ambos quedan verificados.

## Variables de entorno

Crear `back/.env` si no existe (el proyecto incluye valores por defecto):

```
JWT_SECRET=secret
BCRYPT_COST=12
FRONT_URL=http://localhost:4200
MAIL_HOST=...
MAIL_USER=...
MAIL_PASS=...
```
