"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { accountFormSchema } from "@/schemas/account";
import { requireAdmin } from "@/lib/services/auth";
import { sanitizeText } from "@/lib/services/sanitize";
import {
  createAccount,
  deleteAccount,
  duplicateAccount,
  setAccountStatus,
  updateAccount
} from "@/lib/services/accounts";

type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function parseMedia(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  return JSON.parse(value);
}

function getPayload(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    uid: formData.get("uid"),
    collectionLevel: formData.get("collectionLevel"),
    mythics: formData.get("mythics"),
    ultimateSets: formData.get("ultimateSets"),
    upgradeableGuns: formData.get("upgradeableGuns"),
    superCars: formData.get("superCars"),
    conquerorTitles: formData.get("conquerorTitles"),
    ultimateRoyaleTitles: formData.get("ultimateRoyaleTitles"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    media: parseMedia(formData.get("media"))
  };

  const parsed = accountFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { data: null, errors: parsed.error.flatten().fieldErrors };
  }

  return {
    data: {
      ...parsed.data,
      title: sanitizeText(parsed.data.title),
      description: sanitizeText(parsed.data.description),
      uid: sanitizeText(parsed.data.uid),
      soldAt: null
    },
    errors: null
  };
}

export async function createAccountAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = getPayload(formData);

  if (!parsed.data) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }

  try {
    const id = await createAccount(parsed.data);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect(`/admin/accounts/${id}/edit?created=1`);
  } catch (error) {
    if ((error as Error).message === "NEXT_REDIRECT") throw error;
    return { ok: false, message: (error as Error).message };
  }
}

export async function updateAccountAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = getPayload(formData);

  if (!parsed.data) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }

  try {
    await updateAccount(id, parsed.data);
    revalidatePath("/");
    revalidatePath(`/accounts/${id}`);
    revalidatePath("/admin");
    return { ok: true, message: "Account updated." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function deleteAccountAction(id: string) {
  await requireAdmin();
  await deleteAccount(id);
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function markAccountStatusAction(id: string, status: "available" | "sold" | "reserved") {
  await requireAdmin();
  z.enum(["available", "sold", "reserved"]).parse(status);
  await setAccountStatus(id, status);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function duplicateAccountAction(id: string) {
  await requireAdmin();
  const newId = await duplicateAccount(id);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/accounts/${newId}/edit`);
}
