import { cn } from "@/lib/utils";

export function SanketMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("text-foreground", className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <path
        d="M11 32.5 L20 18.5 L25.5 26.5 L29.5 20 L37 32.5 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M17.2 24.5 L20 20.2 L22.7 24.5 Z" fill="currentColor" fillOpacity="0.8" />
      <path d="M8 36.5 H40" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

export function SanketLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <SanketMark size={compact ? 28 : 34} />
      {!compact && (
        <div className="leading-none">
          <div className="font-mono text-[16px] font-semibold tracking-[0.28em] text-foreground">
            SANKET
          </div>
          <div className="label-xs mt-1.5">Landslide Intelligence System</div>
        </div>
      )}
    </div>
  );
}
