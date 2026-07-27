export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-[18px] bg-slate-200/45 dark:bg-slate-700/45 ${className}`} />
}
