import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  BrainCircuit,
  ChevronRight,
  Database,
  History,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SanketLogo } from "./Logo";
import { LiveDot } from "./primitives";
import { SimulationPanel } from "./SimulationPanel";
import { setLastSync, useSanket } from "@/lib/sanket-store";
import { NETWORK } from "@/lib/risk-engine";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live-monitoring", label: "Live Monitoring", icon: Activity },
  { to: "/risk-map", label: "Risk Map", icon: MapIcon },
  { to: "/sensor-data", label: "Sensor Data", icon: Database },
  { to: "/predictions", label: "Predictions", icon: BrainCircuit },
  { to: "/historical-data", label: "Historical Data", icon: History },
] as const;

function Clock() {
  const lastSync = useSanket((s) => s.lastSync);
  useEffect(() => {
    const tick = () =>
      setLastSync(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="mono-num">{lastSync}</span>;
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const alerts = useSanket((s) => s.alerts.filter((a) => a.status === "ACTIVE").length);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          <SanketLogo />
          <button className="lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          <div className="label-xs px-2 pt-1 pb-2">Operations</div>
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors duration-150",
                  active
                    ? "bg-sidebar-accent text-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-5 w-[2px] rounded-full transition-colors",
                    active ? "bg-primary" : "bg-transparent",
                  )}
                />
                <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1">{label}</span>
                {to === "/" && alerts > 0 && (
                  <span className="mono-num rounded-sm bg-risk-critical/15 px-1.5 py-0.5 text-[10px] text-risk-critical">
                    {alerts}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <span className="label-xs">Sensor network</span>
            <span className="mono-num text-[11px] text-foreground">
              {NETWORK.online}/{NETWORK.total}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-risk-low"
              style={{ width: `${(NETWORK.online / NETWORK.total) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <LiveDot />
            <span className="label-xs">Data stream active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const alerts = useSanket((s) => s.alerts);
  const active = alerts.filter((a) => a.status === "ACTIVE");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-medium text-foreground">
          Landslide Early Warning System
        </h1>
        <div className="mt-0.5 flex items-center gap-2">
          <LiveDot />
          <span className="label-xs">System operational</span>
          <span className="hidden text-border sm:inline">|</span>
          <span className="label-xs hidden sm:inline">
            Last sync <Clock />
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="mr-2 hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 xl:flex">
          <LiveDot tone="primary" />
          <span className="label-xs">Live</span>
          <span className="mono-num text-[11px] text-muted-foreground">
            {NETWORK.online}/{NETWORK.total} sensors online
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {active.length > 0 && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-risk-critical" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[320px] overflow-hidden rounded-md border border-border bg-popover shadow-2xl">
              <div className="border-b border-border px-3 py-2">
                <span className="label-xs">Active alerts — {active.length}</span>
              </div>
              <ul className="max-h-[300px] overflow-y-auto">
                {active.map((a) => (
                  <li key={a.id} className="border-b border-border/60 px-3 py-2.5 last:border-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-[0.1em]",
                          a.severity === "CRITICAL" ? "text-risk-critical" : "text-risk-high",
                        )}
                      >
                        {a.severity}
                      </span>
                      <span className="mono-num text-[10px] text-muted-foreground">{a.time}</span>
                    </div>
                    <div className="mt-1 text-[13px] text-foreground">{a.location}</div>
                    <div className="text-[11px] text-muted-foreground">{a.trigger}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-1.5">
          <div className="relative">
            <div className="flex size-7 items-center justify-center rounded-sm bg-primary/15 font-mono text-[11px] text-primary">
              AD
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-card bg-risk-low" />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="font-mono text-[11px] tracking-[0.1em] text-foreground">ADMIN</div>
            <div className="text-[10px] text-muted-foreground">DM Cell · WB</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:pl-[248px]">
        <Header onMenu={() => setNavOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <SimulationPanel />
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      {items.map((it, i) => (
        <span key={it} className="label-xs flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3 opacity-50" />}
          {it}
        </span>
      ))}
    </div>
  );
}
