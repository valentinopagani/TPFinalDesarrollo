import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_users",
    description: "Lista todos los usuarios registrados (requiere JWT + Admin)",
    handler: async () => api.get("/users"),
  },
  {
    name: "update_user_role",
    description:
      "Cambia el rol de un usuario. No se puede cambiar el propio rol ni degradar al único admin (requiere JWT + Admin)",
    inputSchema: {
      id: z.string(),
      role: z.enum(["user", "admin"]),
    },
    handler: async ({ id, role }: any) =>
      api.patch(`/users/${id}/role`, { role }),
  },
  {
    name: "update_my_password",
    description:
      "Cambia la contraseña del usuario autenticado (requiere JWT)",
    inputSchema: {
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    },
    handler: async (body: any) => api.patch("/users/me/password", body),
  },
  {
    name: "update_my_email",
    description: "Cambia el email del usuario autenticado (requiere JWT)",
    inputSchema: {
      newEmail: z.string().email(),
      password: z.string(),
    },
    handler: async (body: any) => api.patch("/users/me/email", body),
  },
] as ToolDef[];
