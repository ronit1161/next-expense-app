import { Activity, RefreshCw, Server, HardDrive, Cpu, Loader2 } from 'lucide-react';

export default function AdminHealthTab({
  health,
  loadingHealth,
  pingingDb,
  handlePingDb,
}) {
  return (
    <div className="space-y-6">
      {loadingHealth ? (
        <div className="fintech-card p-12 text-center rounded-3xl">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-400">
            Running Database &amp; Server Diagnostics...
          </p>
        </div>
      ) : health ? (
        <>
          {/* Vitals Summary Card */}
          <div className="fintech-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white ${
                  health.status === 'HEALTHY'
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              >
                <Activity className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    PostgreSQL Connection Matrix
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      health.status === 'HEALTHY'
                        ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'
                        : 'bg-rose-500/15 text-rose-600 border border-rose-500/20'
                    }`}
                  >
                    Status: {health.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Engine: Neon Serverless Postgres &bull; Latency:{' '}
                  <strong className="text-teal-600 dark:text-teal-400 font-bold tabular-nums">
                    {health.databaseLatencyMs} ms
                  </strong>
                </p>
              </div>
            </div>

            <button
              onClick={handlePingDb}
              disabled={pingingDb}
              className="fintech-btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${pingingDb ? 'animate-spin text-teal-600' : 'text-teal-600 dark:text-teal-400'}`}
              />
              <span>{pingingDb ? 'Pinging DB...' : 'Test DB Latency'}</span>
            </button>
          </div>

          {/* Table Row Statistics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Database Row Telemetry
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Live Schema Count
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="fintech-card p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Users</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.users ?? 0}
                </p>
              </div>

              <div className="fintech-card p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Expenses</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.expenses ?? 0}
                </p>
              </div>

              <div className="fintech-card p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Budgets</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.budgets ?? 0}
                </p>
              </div>

              <div className="fintech-card p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Loans</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.loans ?? 0}
                </p>
              </div>

              <div className="fintech-card p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Settlements</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.settlements ?? 0}
                </p>
              </div>

              <div className="fintech-card p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <p className="text-[11px] font-bold opacity-80 uppercase">Total Rows</p>
                <p className="text-xl font-black mt-1 tabular-nums">
                  {health.tableCounts?.totalRecords ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Server Runtime Environment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="fintech-card p-5 rounded-2xl flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Node &amp; Runtime
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {health.runtime?.nodeVersion || 'Node.js'} &bull; {health.runtime?.environment || 'production'}
                </p>
              </div>
            </div>

            <div className="fintech-card p-5 rounded-2xl flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-indigo-500 shrink-0">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Heap Memory Usage
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  {health.runtime?.memoryUsage?.heapUsedMb || '—'} MB /{' '}
                  {health.runtime?.memoryUsage?.heapTotalMb || '—'} MB
                </p>
              </div>
            </div>

            <div className="fintech-card p-5 rounded-2xl flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-500 shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Server Uptime
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  {Math.floor((health.runtime?.uptimeSeconds || 0) / 60)} min ({health.runtime?.uptimeSeconds || 0}s)
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
