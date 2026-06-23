import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SplitWrite",
  description: "Custom per-item bill splitting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">
                  S
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  Split<span className="text-brand-600">Write</span>
                </span>
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-4xl px-4 py-8 text-center text-xs text-slate-400">
            Made with ❤️ by Tanishq
          </footer>
        </div>
      </body>
    </html>
  );
}
