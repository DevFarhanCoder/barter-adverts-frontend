import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookText } from "lucide-react";

type TocItem = { id: string; label: string };
type LegalTheme = "bwLight" | "bwDark";

type LegalPageShellProps = {
  title: string;
  effectiveDate?: string;
  children: React.ReactNode;
  toc?: TocItem[];
  badge?: string;
  theme?: LegalTheme; // NEW (default: bwLight)
};

const LegalPageShell: React.FC<LegalPageShellProps> = ({
  title,
  effectiveDate,
  children,
  toc = [],
  badge,
  theme = "bwLight",
}) => {
  const isDark = theme === "bwDark";

  return (
    <section className={isDark ? "min-h-screen bg-neutral-950 py-16" : "min-h-screen bg-neutral-50 py-16"}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className={`flex items-center justify-between ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
          <Link
            to="/"
            className={`inline-flex items-center gap-2 ${isDark ? "hover:text-white" : "hover:text-neutral-900"} transition`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <BookText className="w-5 h-5" />
            <span className="text-sm">Legal</span>
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main card */}
        <div className={isDark
            ? "rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl"
            : "rounded-2xl border border-neutral-200 bg-white shadow-xl"}>
          <div className={`p-6 md:p-10 ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
              {effectiveDate && (
                <p className={`mt-2 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                  {badge ? `${badge}:` : "Effective Date:"} {effectiveDate}
                </p>
              )}
            </div>

            <div className={`space-y-10 leading-relaxed ${isDark ? "text-neutral-200" : "text-neutral-700"}`}>
              {children}
            </div>
          </div>
        </div>

        {/* Sidebar TOC */}
        <aside className="lg:sticky lg:top-20 h-max">
          <div className={isDark
              ? "rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-200 p-5 shadow-xl"
              : "rounded-2xl border border-neutral-200 bg-white text-neutral-700 p-5 shadow-xl"}>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">On this page</h3>
            <nav className="space-y-2">
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={`block rounded-lg px-3 py-2 text-sm ${isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50"} transition`}
                >
                  {t.label}
                </a>
              ))}
            </nav>
            <div className={`mt-6 pt-6 border-t ${isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-200 text-neutral-500"} text-xs`}>
              Need help? <Link to="/contact" className="underline">Contact us</Link>.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default LegalPageShell;
