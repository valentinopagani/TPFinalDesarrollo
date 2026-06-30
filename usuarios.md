# Usuarios de prueba

| Rol   | Email            | Contraseña  | Verificado |
|-------|------------------|-------------|------------|
| admin | admin@test.com   | Admin1234!  | sí         |
| user  | user@test.com    | User1234!   | sí         |

> Antes de correr los tests, verificar que `user@test.com` tenga `role: user`
> (el test lo promueve a admin durante la ejecución).
>
> Para resetearlo:
> ```bash
> cd ~/tpback && node -e "
> const db = new (require('sqlite3').Database)('tp_final');
> db.run(\"UPDATE users SET role='user' WHERE email='user@test.com'\", () => db.close());
> "
> ```
