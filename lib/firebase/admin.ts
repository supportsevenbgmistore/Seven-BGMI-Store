import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { env } from "@/lib/utils/env";

export function getFirebaseAdminApp() {
  if (getApps().length) return getApps()[0];

  const { projectId, clientEmail, privateKey } = env.firebase;
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

export function getDb() {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

export function toIsoDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}
