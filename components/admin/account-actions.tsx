"use client";

import Link from "next/link";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAccountAction, duplicateAccountAction, markAccountStatusAction } from "@/actions/accounts";

export function AccountActions({ id, status }: { id: string; status: "available" | "sold" | "reserved" }) {
  const markAvailable = markAccountStatusAction.bind(null, id, "available");
  const markSold = markAccountStatusAction.bind(null, id, "sold");
  const markReserved = markAccountStatusAction.bind(null, id, "reserved");
  const duplicate = duplicateAccountAction.bind(null, id);
  const remove = deleteAccountAction.bind(null, id);

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="secondary">
        <Link href={`/admin/accounts/${id}/edit`}>
          <Edit className="h-4 w-4" />
          Edit
        </Link>
      </Button>
      {status !== "available" ? (
        <form action={markAvailable}>
          <Button size="sm" variant="secondary" type="submit">Available</Button>
        </form>
      ) : null}
      {status !== "sold" ? (
        <form action={markSold}>
          <Button size="sm" variant="secondary" type="submit">Sold</Button>
        </form>
      ) : null}
      {status !== "reserved" ? (
        <form action={markReserved}>
          <Button size="sm" variant="secondary" type="submit">Reserve</Button>
        </form>
      ) : null}
      <form action={duplicate}>
        <Button size="sm" variant="secondary" type="submit" aria-label="Duplicate">
          <Copy className="h-4 w-4" />
        </Button>
      </form>
      <form action={remove}>
        <Button size="sm" variant="danger" type="submit" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
