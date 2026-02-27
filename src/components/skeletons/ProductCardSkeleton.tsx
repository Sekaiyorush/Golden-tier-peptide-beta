import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#D4AF37]/10 overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full bg-slate-100" />
      <div className="p-8 space-y-4">
        <Skeleton className="h-3 w-16 bg-slate-100" />
        <Skeleton className="h-6 w-3/4 bg-slate-100" />
        <Skeleton className="h-3 w-full bg-slate-100" />
        <Skeleton className="h-3 w-2/3 bg-slate-100" />
        <div className="flex justify-between pt-6 border-t border-[#D4AF37]/10">
          <Skeleton className="h-6 w-20 bg-slate-100" />
          <Skeleton className="h-10 w-12 bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
