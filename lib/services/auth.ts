import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { env } from "@/lib/utils/env";

export async function getSessionUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.email || user.email.toLowerCase() !== env.adminEmail) {
    redirect("/admin");
  }
  return user;
}

export async function requireAdminApi() {
  const user = await getSessionUser();
  if (!user?.email || user.email.toLowerCase() !== env.adminEmail) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function isAdmin() {
  const user = await getSessionUser();
  return Boolean(user?.email && user.email.toLowerCase() === env.adminEmail);
}
