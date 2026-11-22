import { Coffee, KeyRound } from 'lucide-react';

/** Friendly screen shown when .env.local is missing the Supabase variables. */
export function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-espresso-100 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-espresso-900 text-caramel-300">
            <Coffee className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl text-espresso-900">BrewStock</h1>
            <p className="text-xs text-espresso-500">One quick setup step</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-cream-50 p-4 ring-1 ring-inset ring-espresso-100">
          <div className="flex items-center gap-2 text-caramel-700">
            <KeyRound className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wide">Add your Supabase keys</p>
          </div>
          <p className="mt-2 text-sm text-espresso-600">
            Create a <code className="rounded bg-white px-1 py-0.5 text-xs">.env.local</code> file in
            the project root:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-espresso-900 p-3 text-[11px] leading-relaxed text-cream-100">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-espresso-500">
          Then run the SQL in <code className="font-semibold">supabase/schema.sql</code> in the
          Supabase SQL editor and restart the dev server.
        </p>
      </div>
    </div>
  );
}
