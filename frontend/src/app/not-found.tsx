import Link from "next/link";
import { Home } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-xl">
          <CardContent className="text-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">404</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">Page not found</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              The page you are looking for does not exist or may have been moved.
            </p>
            <Link href="/" className={buttonClasses("primary", "mt-6")}>
              <Home className="h-4 w-4" />
              Back to dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
