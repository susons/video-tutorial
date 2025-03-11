"use server";

import { z } from "zod";
import { courseSchema } from "../schemas/courses/course";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";

export const createCourse = async (
  unsafeData: z.infer<typeof courseSchema>
) => {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourses(await getCurrentUser()))
    return {
      error: true,
      message: "There was an error creating course!",
    };

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
};
