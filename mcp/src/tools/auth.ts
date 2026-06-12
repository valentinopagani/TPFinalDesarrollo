import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "auth_login",
    description: "Inicia sesión en api-c y guarda el token JWT",
    inputSchema: { email: z.string().email(), password: z.string() },
    handler: async ({ email, password }: any) => {
      const res = await api.login(email, password);
      api.setToken(res.access_token);
      return res.user;
    },
  },
  {
    name: "auth_register",
    description: "Registra un nuevo usuario en api-c y guarda el token JWT",
    inputSchema: { email: z.string().email(), password: z.string().min(8) },
    handler: async ({ email, password }: any) => {
      const res = await api.register(email, password);
      api.setToken(res.access_token);
      return res.user;
    },
  },
  {
    name: "auth_me",
    description: "Obtiene los datos del usuario autenticado actualmente",
    handler: async () => api.get("/auth/me"),
  },
  {
    name: "delete_my_account",
    description: "Elimina la cuenta del usuario autenticado",
    inputSchema: { password: z.string() },
    handler: async (body: any) => api.del("/users/me", { data: body }),
  },
] as ToolDef[];
