import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          <footer className="border-t border-zinc-200 px-4 py-5 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            Design & Developed by{" "}
            <a
              href="https://lucifer01430.github.io/Portfolio"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-white"
            >
              Harsh
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
