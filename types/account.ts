export type AccountStatus = "available" | "sold" | "reserved";

export type MediaAsset = {
  id: string;
  fileName: string;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  size?: number;
  kind: "image" | "video";
  provider: "vercel-blob";
  createdAt?: string;
};

export type AccountListing = {
  id: string;
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
  status: AccountStatus;
  media: MediaAsset[];
  featured: boolean;
  views: number;
  soldAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AccountFilters = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  mythics?: number;
  ultimateSets?: number;
  upgradeableGuns?: number;
  collectionLevel?: number;
  availableOnly?: boolean;
  sort?: "newest" | "oldest" | "price-low" | "price-high";
};

export type DashboardStats = {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  revenue: number;
  todayPosts: number;
};

export type ChartPoint = {
  name: string;
  posts?: number;
  sold?: number;
  revenue?: number;
};

export type ActivityItem = {
  id: string;
  type: "created" | "updated" | "deleted" | "sold" | "reserved" | "duplicated";
  label: string;
  accountId?: string;
  createdAt: string;
};
