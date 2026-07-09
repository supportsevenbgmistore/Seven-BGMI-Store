import { z } from "zod";

export const accountStatusSchema = z.enum(["available", "sold", "reserved"]);

export const mediaAssetSchema = z.object({
  id: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  size: z.number().optional(),
  kind: z.enum(["image", "video"]),
  provider: z.literal("vercel-blob").default("vercel-blob"),
  createdAt: z.string().optional()
});

const intField = (label: string) =>
  z.coerce.number().int().min(0, `${label} cannot be negative`).default(0);

export const accountFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().max(5000).default(""),
  price: z.coerce.number({ required_error: "Price is required", invalid_type_error: "Price is required" }).positive("Price is required"),
  uid: z.string().max(40).default(""),
  collectionLevel: intField("Collection level"),
  mythics: intField("Mythics"),
  ultimateSets: intField("Ultimate sets"),
  upgradeableGuns: intField("Upgradeable guns"),
  superCars: intField("Super cars"),
  conquerorTitles: intField("Conqueror titles"),
  ultimateRoyaleTitles: intField("Ultimate Royale titles"),
  status: accountStatusSchema.default("available"),
  media: z.array(mediaAssetSchema).default([]),
  featured: z.coerce.boolean().default(false)
});

export const accountFilterSchema = z.object({
  query: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  mythics: z.coerce.number().optional(),
  ultimateSets: z.coerce.number().optional(),
  upgradeableGuns: z.coerce.number().optional(),
  collectionLevel: z.coerce.number().optional(),
  availableOnly: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "oldest", "price-low", "price-high"]).optional()
});

export type AccountFormInput = z.infer<typeof accountFormSchema>;
