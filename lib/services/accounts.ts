import { FieldValue } from "firebase-admin/firestore";
import { getDb, toIsoDate } from "@/lib/firebase/admin";
import { deleteMediaAssets } from "@/lib/services/blob";
import { slugify } from "@/lib/utils/format";
import type { AccountFilters, AccountListing, ActivityItem, ChartPoint, DashboardStats, MediaAsset } from "@/types/account";

const ACCOUNTS = "accounts";
const ACTIVITY = "activity";

function fromDoc(id: string, data: FirebaseFirestore.DocumentData): AccountListing {
  return {
    id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    price: Number(data.price || 0),
    uid: data.uid,
    collectionLevel: Number(data.collectionLevel || 0),
    mythics: Number(data.mythics || 0),
    ultimateSets: Number(data.ultimateSets || 0),
    upgradeableGuns: Number(data.upgradeableGuns || 0),
    superCars: Number(data.superCars || 0),
    conquerorTitles: Number(data.conquerorTitles || 0),
    ultimateRoyaleTitles: Number(data.ultimateRoyaleTitles || 0),
    status: data.status,
    media: data.media || [],
    featured: Boolean(data.featured),
    views: Number(data.views || 0),
    soldAt: data.soldAt ? toIsoDate(data.soldAt) : null,
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt)
  };
}

function applyFilters(accounts: AccountListing[], filters: AccountFilters = {}) {
  const query = filters.query?.trim().toLowerCase();

  const filtered = accounts.filter((account) => {
    if (query) {
      const haystack = `${account.title} ${account.description} ${account.uid}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.availableOnly && account.status !== "available") return false;
    if (filters.minPrice !== undefined && account.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && account.price > filters.maxPrice) return false;
    if (filters.mythics !== undefined && account.mythics < filters.mythics) return false;
    if (filters.ultimateSets !== undefined && account.ultimateSets < filters.ultimateSets) return false;
    if (filters.upgradeableGuns !== undefined && account.upgradeableGuns < filters.upgradeableGuns) return false;
    if (filters.collectionLevel !== undefined && account.collectionLevel < filters.collectionLevel) return false;
    return true;
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}

export async function listAccounts(filters: AccountFilters = {}, limit = 60) {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db.collection(ACCOUNTS).orderBy("createdAt", "desc").limit(120).get();
  const accounts = snapshot.docs.map((doc) => fromDoc(doc.id, doc.data()));
  return applyFilters(accounts, filters).slice(0, limit);
}

export async function listFeaturedAccounts() {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection(ACCOUNTS)
    .where("featured", "==", true)
    .limit(8)
    .get();

  const featured = snapshot.docs
    .map((doc) => fromDoc(doc.id, doc.data()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (featured.length) return featured;
  return listAccounts({ sort: "newest" }, 8);
}

export async function getAccount(idOrSlug: string) {
  const db = getDb();
  if (!db) return null;

  const direct = await db.collection(ACCOUNTS).doc(idOrSlug).get();
  if (direct.exists) return fromDoc(direct.id, direct.data() || {});

  const snapshot = await db.collection(ACCOUNTS).where("slug", "==", idOrSlug).limit(1).get();
  const doc = snapshot.docs[0];
  return doc ? fromDoc(doc.id, doc.data()) : null;
}

export async function incrementAccountViews(id: string) {
  const db = getDb();
  if (!db) return;
  await db.collection(ACCOUNTS).doc(id).update({ views: FieldValue.increment(1) }).catch(() => undefined);
}

export async function createAccount(data: Omit<AccountListing, "id" | "createdAt" | "updatedAt" | "slug" | "views">) {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured.");

  const now = FieldValue.serverTimestamp();
  const doc = db.collection(ACCOUNTS).doc();
  const slug = `${slugify(data.title)}-${doc.id.slice(0, 6)}`;

  const payload: Record<string, unknown> = {
    ...data,
    slug,
    views: 0,
    searchText: `${data.title} ${data.description} ${data.uid}`.toLowerCase(),
    soldAt: data.status === "sold" ? now : null,
    createdAt: now,
    updatedAt: now
  };

  await doc.set(payload);
  await logActivity("created", `Created ${data.title}`, doc.id);
  return doc.id;
}

export async function updateAccount(id: string, data: Partial<Omit<AccountListing, "id" | "createdAt" | "updatedAt" | "views">>) {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured.");

  if (data.media) {
    const existing = await getAccount(id);
    if (existing) {
      await deleteRemovedMedia(existing.media, data.media);
    }
  }

  const payload = {
    ...data,
    searchText: `${data.title || ""} ${data.description || ""} ${data.uid || ""}`.toLowerCase(),
    updatedAt: FieldValue.serverTimestamp(),
    soldAt: data.status === "sold" ? FieldValue.serverTimestamp() : data.status ? null : undefined
  };

  await db.collection(ACCOUNTS).doc(id).update(payload);
  await logActivity("updated", `Updated ${data.title || "account listing"}`, id);
}

export async function deleteAccount(id: string) {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured.");

  const existing = await getAccount(id);
  if (existing?.media.length) {
    await deleteMediaAssets(existing.media).catch(() => undefined);
  }

  await db.collection(ACCOUNTS).doc(id).delete();
  await logActivity("deleted", "Deleted account listing", id);
}

export async function setAccountStatus(id: string, status: AccountListing["status"]) {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured.");

  await db.collection(ACCOUNTS).doc(id).update({
    status,
    soldAt: status === "sold" ? FieldValue.serverTimestamp() : null,
    updatedAt: FieldValue.serverTimestamp()
  });
  await logActivity(status === "sold" ? "sold" : "reserved", `Marked listing ${status}`, id);
}

export async function duplicateAccount(id: string) {
  const source = await getAccount(id);
  if (!source) throw new Error("Account not found.");

  const copy = {
    ...source,
    title: `${source.title} Copy`,
    status: "reserved" as const,
    featured: false,
    soldAt: null
  };

  const newId = await createAccount(copy);
  await logActivity("duplicated", `Duplicated ${source.title}`, newId);
  return newId;
}

export async function getDashboardData() {
  const accounts = await listAccounts({}, 500);
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const stats: DashboardStats = {
    total: accounts.length,
    available: accounts.filter((item) => item.status === "available").length,
    sold: accounts.filter((item) => item.status === "sold").length,
    reserved: accounts.filter((item) => item.status === "reserved").length,
    revenue: accounts.filter((item) => item.status === "sold").reduce((sum, item) => sum + item.price, 0),
    todayPosts: accounts.filter((item) => item.createdAt.startsWith(today)).length
  };

  return {
    stats,
    dailyPosts: buildDailyPosts(accounts),
    monthlyPosts: buildMonthly(accounts, "posts"),
    monthlySales: buildMonthly(accounts.filter((item) => item.status === "sold"), "sold"),
    revenueTrend: buildRevenue(accounts),
    activity: await listActivity()
  };
}

async function deleteRemovedMedia(previous: MediaAsset[], next: MediaAsset[]) {
  const nextIds = new Set(next.map((item) => item.id));
  const removed = previous.filter((item) => !nextIds.has(item.id));
  if (!removed.length) return;

  await deleteMediaAssets(removed);
}

async function logActivity(type: ActivityItem["type"], label: string, accountId?: string) {
  const db = getDb();
  if (!db) return;
  await db.collection(ACTIVITY).add({
    type,
    label,
    accountId,
    createdAt: FieldValue.serverTimestamp()
  });
}

async function listActivity() {
  const db = getDb();
  if (!db) return [];
  const snapshot = await db.collection(ACTIVITY).orderBy("createdAt", "desc").limit(12).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      label: data.label,
      accountId: data.accountId,
      createdAt: toIsoDate(data.createdAt)
    } satisfies ActivityItem;
  });
}

function buildDailyPosts(accounts: AccountListing[]): ChartPoint[] {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      name: date.toLocaleDateString("en-IN", { weekday: "short" }),
      posts: accounts.filter((item) => item.createdAt.startsWith(key)).length
    };
  });
}

function buildMonthly(accounts: AccountListing[], key: "posts" | "sold"): ChartPoint[] {
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const month = date.toISOString().slice(0, 7);
    return {
      name: date.toLocaleDateString("en-IN", { month: "short" }),
      [key]: accounts.filter((item) => item.createdAt.startsWith(month) || item.soldAt?.startsWith(month)).length
    };
  });
}

function buildRevenue(accounts: AccountListing[]): ChartPoint[] {
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const month = date.toISOString().slice(0, 7);
    return {
      name: date.toLocaleDateString("en-IN", { month: "short" }),
      revenue: accounts
        .filter((item) => item.status === "sold" && item.soldAt?.startsWith(month))
        .reduce((sum, item) => sum + item.price, 0)
    };
  });
}
