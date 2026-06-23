"use client";

import { useRouter, usePathname } from "next/navigation";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { House, FileText, SquarePen } from "lucide-react";

interface NavTab {
  title: string;
  icon: typeof House;
  href: string;
}

const tabs: NavTab[] = [
  { title: "Home", icon: House, href: "/" },
  { title: "Blog", icon: FileText, href: "/blog" },
  { title: "Write", icon: SquarePen, href: "/admin" },
];

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const selectedIndex = tabs.findIndex(
    (t) => pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href))
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 gap-2">
        <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground shrink-0">
          thoughts<span className="text-accent">.</span>
        </span>
        <ExpandableTabs
          tabs={tabs}
          selected={selectedIndex >= 0 ? selectedIndex : null}
          onChange={(index) => {
            if (index !== null) {
              router.push(tabs[index].href);
            }
          }}
          activeColor="text-accent"
          className="border-transparent bg-transparent shadow-none flex-nowrap overflow-hidden"
        />
      </div>
    </nav>
  );
}
