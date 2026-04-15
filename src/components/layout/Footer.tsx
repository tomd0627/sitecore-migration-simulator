export function Footer() {
  return (
    <footer className="border-t border-edge mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <p>
            Built with{" "}
            <span className="text-sitecore font-medium">Sitecore SXA</span>
            {" → "}
            <span className="text-nextjs font-medium">Next.js 15</span>
            {" "}knowledge from real enterprise migrations.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-sitecore"
                aria-hidden="true"
              />
              Sitecore / Legacy
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-nextjs"
                aria-hidden="true"
              />
              Next.js / Modern
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-violet"
                aria-hidden="true"
              />
              Decision Point
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
