import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_categories",
    description:
      "Lista todas las categorías ordenadas por nombre (requiere JWT)",
    handler: async () => api.get("/categories"),
  },
  {
    name: "get_category",
    description: "Obtiene una categoría por su ID (requiere JWT)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.get(`/categories/${id}`),
  },
  {
    name: "create_category",
    description: "Crea una nueva categoría (requiere JWT + Admin)",
    inputSchema: { name: z.string().min(1).max(128) },
    handler: async (body: any) => api.post("/categories", body),
  },
  {
    name: "update_category",
    description: "Actualiza el nombre de una categoría (requiere JWT + Admin)",
    inputSchema: { id: z.number().int(), name: z.string().min(1).max(128) },
    handler: async ({ id, ...body }: any) => api.put(`/categories/${id}`, body),
  },
  {
    name: "delete_category",
    description: "Elimina una categoría existente (requiere JWT + Admin)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.del(`/categories/${id}`),
  },
] as ToolDef[];
