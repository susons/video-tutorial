import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserCourseAccessTable } from "./userCourseAccess";
import { CourseProductTable } from "./courseProduct";

export const CourseTable = pgTable("courses", {
  id: id,
  name: text().notNull(),
  description: text().notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const CourseRelationships = relations(CourseTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
  userCourseAccesses: many(UserCourseAccessTable),
}));
