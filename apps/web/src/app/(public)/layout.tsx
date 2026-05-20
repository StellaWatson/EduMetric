/**
 * Public layout — no auth required. Used by /public/dashboard
 * (institutional ranking spreadsheet).
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <span className="font-semibold tracking-tight">EduMetric · Public dashboard</span>
          <a href="/login" className="text-sm text-primary hover:underline">
            Sign in
          </a>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}
