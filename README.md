# Seven BGMI Store

A production-ready Next.js 15 showcase/store for premium BGMI account listings. Public visitors can browse listings without login. Google sign-in is used only for the single admin account configured through `ADMIN_EMAIL`.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS 4, shadcn-style UI primitives, Framer Motion, Lucide icons
- NextAuth/Auth.js with Google OAuth
- Firebase Firestore through the Admin SDK
- Vercel Blob for image/video storage and delivery
- Server Actions and Route Handlers
- Recharts, Zustand, Zod, React Hook Form-ready validation architecture

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
ADMIN_EMAIL=
SUPPORT_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_BLOB_FOLDER=seven-bgmi-store
INSTAGRAM_URL=
WHATSAPP_URL=
TELEGRAM_URL=
LINKEDIN_URL=
FACEBOOK_URL=
YOUTUBE_URL=
```

Notes:

- `ADMIN_EMAIL` is the only account that can access `/admin/dashboard` and `/admin/accounts/*`.
- `FIREBASE_PRIVATE_KEY` should keep escaped newlines when stored in Vercel: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`.
- `NEXT_PUBLIC_BLOB_FOLDER` is optional and defaults to `seven-bgmi-store`.

## Firestore Schema

Collection: `accounts`

```ts
{
  title: string;
  slug: string;
  description: string;
  price: number;
  uid: string;
  collectionLevel: number;
  mythics: number;
  ultimateSets: number;
  upgradeableGuns: number;
  superCars: number;
  conquerorTitles: number;
  ultimateRoyaleTitles: number;
  status: "available" | "sold" | "reserved";
  media: Array<{
    id: string;          // Vercel Blob pathname
    fileName: string;
    mimeType: string;
    url: string;
    thumbnailUrl?: string;
    size?: number;
    kind: "image" | "video";
    provider: "vercel-blob";
    createdAt: string;
  }>;
  featured: boolean;
  views: number;
  soldAt?: Timestamp | null;
  searchText: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Collection: `activity`

```ts
{
  type: "created" | "updated" | "deleted" | "sold" | "reserved" | "duplicated";
  label: string;
  accountId?: string;
  createdAt: Timestamp;
}
```

Recommended indexes:

- `accounts`: `featured ASC`, `createdAt DESC`
- `accounts`: `slug ASC`
- `accounts`: `createdAt DESC`
- `activity`: `createdAt DESC`

## Firebase Setup

1. Create a Firebase project.
2. Enable Firestore.
3. Create a service account in Firebase project settings.
4. Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` to `.env.local`.
5. Use server-side Admin SDK access only. Public writes should not be allowed from Firestore client SDKs.

Example Firestore rules if no browser client writes are used:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Google OAuth Setup

1. Create an OAuth client in Google Cloud Console.
2. Add authorized redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Vercel: `https://your-domain.com/api/auth/callback/google`
3. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.

## Vercel Blob Setup

1. Create a Blob store in the Vercel project Storage tab.
2. Connect it to the project environments where uploads should work.
3. Pull or set `BLOB_READ_WRITE_TOKEN` locally and in deployment.
4. Optionally set `NEXT_PUBLIC_BLOB_FOLDER` to control the upload path prefix.

When admin uploads media, the browser uploads directly to Vercel Blob using a short-lived client token from `/api/admin/media`. Files do not pass through the Next.js request body, so large videos use Blob multipart upload instead of hitting function body limits. Firestore stores only Blob pathnames and metadata.

## Admin Workflow

- `/admin`: Google sign-in screen.
- `/admin/dashboard`: analytics, overview cards, charts, activity, recent listings.
- `/admin/accounts/new`: create listing.
- `/admin/accounts/[id]/edit`: edit listing.
- Admin can create, edit, delete, mark sold, mark reserved and duplicate listings.

## Security

- Server-side admin authorization is enforced by `requireAdmin()`.
- Middleware protects admin dashboard and account CRUD routes.
- Zod validates account payloads.
- HTML is sanitized before persistence.
- Upload route authenticates the admin and limits client upload tokens to image/video media.
- Firestore browser writes should remain disabled.

For high traffic, replace the in-memory rate limiter with Redis or Vercel KV.

## Payment Architecture

`lib/payments/provider.ts` defines a `PaymentProvider` interface:

- `createIntent(input)`
- `verifyWebhook(payload, signature)`

Future providers can implement Razorpay, Cashfree, PhonePe or Stripe without changing listing/domain code.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Add all environment variables from `.env.example`.
4. Set `NEXTAUTH_URL` to the production URL.
5. Add the production Google OAuth callback URL.
6. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```
