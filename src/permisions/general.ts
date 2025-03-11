import { UserRole } from "@/drizzle/schema";

export const canAccessAdmin = ({ role }: { role: UserRole | undefined }) =>
  role === "admin";
