import { SearchX } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass rounded-lg px-6 py-16 text-center">
      <SearchX className="mx-auto h-10 w-10 text-red-200" />
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{description}</p>
    </div>
  );
}
