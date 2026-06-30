import authTools from "./auth";
import productsTools from "./products";
import categoriesTools from "./categories";
import usersTools from "./users";
import type { ToolDef } from "../tool-factory";

export default [
  ...authTools,
  ...productsTools,
  ...categoriesTools,
  ...usersTools,
] as ToolDef[];
