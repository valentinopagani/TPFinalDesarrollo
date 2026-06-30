import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_products",
    description:
      "Lista productos con filtros opcionales y paginación (requiere JWT)",
    inputSchema: {
      name: z.string().optional(),
      sortBy: z.enum(["id", "name", "price", "stock"]).optional(),
      order: z.enum(["ASC", "DESC"]).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().min(1).max(100).optional(),
    },
    handler: async (params: any) => api.get("/products", { params }),
  },
  {
    name: "get_product",
    description: "Obtiene un producto por su ID (requiere JWT)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.get(`/products/${id}`),
  },
  {
    name: "create_product",
    description: "Crea un nuevo producto (requiere JWT + Admin)",
    inputSchema: {
      name: z.string().min(1).max(256),
      price: z.number().positive(),
      stock: z.number().int().min(0).optional(),
      categoryId: z.number().int().nullable().optional(),
    },
    handler: async (body: any) => api.post("/products", body),
  },
  {
    name: "update_product",
    description:
      "Actualiza un producto existente. Todos los campos son opcionales (requiere JWT + Admin)",
    inputSchema: {
      id: z.number().int(),
      name: z.string().min(1).max(256).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      categoryId: z.number().int().nullable().optional(),
    },
    handler: async ({ id, ...body }: any) => api.put(`/products/${id}`, body),
  },
  {
    name: "delete_product",
    description: "Elimina un producto existente (requiere JWT + Admin)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.del(`/products/${id}`),
  },
] as ToolDef[];
