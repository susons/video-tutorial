import { relations } from "drizzle-orm";
import { pgTable, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseProductTable } from "./courseProduct";

const productStatuses = ["public", "private"] as const;
export type productStatus = (typeof productStatuses)[number];
export const productStatusEnum = pgEnum("product_status", productStatuses);

export const ProductTable = pgTable("products", {
  id: id,
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  priceInDollar: integer().notNull(),
  status: productStatusEnum().notNull().default("private"),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
}));
