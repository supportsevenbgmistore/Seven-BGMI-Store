import { NextResponse } from "next/server";
import { accountFilterSchema } from "@/schemas/account";
import { listAccounts } from "@/lib/services/accounts";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = accountFilterSchema.safeParse(Object.fromEntries(url.searchParams));
  const accounts = await listAccounts(parsed.success ? parsed.data : {}, 60);
  return NextResponse.json({ accounts });
}
