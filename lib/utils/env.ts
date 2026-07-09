const privateKey = (value?: string) => value?.replace(/\\n/g, "\n");

export const env = {
  adminEmail: process.env.ADMIN_EMAIL?.toLowerCase(),
  supportEmail: process.env.SUPPORT_EMAIL,
  nextAuthUrl: process.env.NEXTAUTH_URL,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey(process.env.FIREBASE_PRIVATE_KEY)
  },
  blob: {
    readWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    storeId: process.env.BLOB_STORE_ID,
    folder: process.env.NEXT_PUBLIC_BLOB_FOLDER || "seven-bgmi-store"
  },
  social: {
    instagram: process.env.INSTAGRAM_URL,
    whatsapp: process.env.WHATSAPP_URL,
    telegram: process.env.TELEGRAM_URL,
    linkedin: process.env.LINKEDIN_URL,
    facebook: process.env.FACEBOOK_URL,
    youtube: process.env.YOUTUBE_URL
  }
};

export function getBaseUrl() {
  return env.nextAuthUrl || "http://localhost:3000";
}
