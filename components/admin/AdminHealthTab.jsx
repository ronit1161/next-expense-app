import { Activity, RefreshCw, Server, HardDrive, Cpu, Loader2, Database, CheckCircle2 } from 'lucide-react';

export default function AdminHealthTab({
  health,
  loadingHealth,
  pingingDb,
  handlePingDb,
}) {
  return (
    <div className="space-y-6">
      {loadingHealth ? (
        <div className="clay-card p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-3" />
          <p className="text-xs font-bold text-[var(--text-muted)]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Running Database &amp; Server Diagnostics...
          </p>
        </div>
      ) : health ? (
        <>
          {/* Vitals Summary Card */}
          <div className="clay-card p-6 sm:p-7 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl clay-orb text-white ${
                  health.status === 'HEALTHY'
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-600'
                    : 'bg-gradient-to-br from-rose-500 to-pink-600'
                }`}
              >
                <Activity className="h-7 w-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="font-black text-lg text-[var(--text-primary)]"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    PostgreSQL Connection Matrix
                  </h3>
                  <span
                    className={`clay-badge-pill text-xs font-bold ${
                      health.status === 'HEALTHY'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Status: {health.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                  Engine: Neon Serverless Postgres • Latency:{' '}
                  <strong className="text-violet-600 dark:text-violet-400 font-bold">
                    {health.databaseLatencyMs} ms
                  </strong>
                </p>
              </div>
            </div>

            <button
              onClick={handlePingDb}
              disabled={pingingDb}
              className="clay-btn-secondary px-6 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <RefreshCw
                className={`h-4 w-4 ${pingingDb ? 'animate-spin text-violet-500' : 'text-violet-500'}`}
              />
              <span>{pingingDb ? 'Pinging DB...' : 'Test DB Latency'}</span>
            </button>
          </div>

          {/* Table Row Statistics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3
                className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Database Row Telemetry
              </h3>
              <span className="text-[11px] font-bold text-[var(--text-muted)]">
                Live Schema Count
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="clay-card p-4 rounded-[24px]">
                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Users</p>
                <p
                  className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.tableCounts?.users ?? 0}
                </p>
              </div>

              <div className="clay-card p-4 rounded-[24px]">
                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Expenses</p>
                <p
                  className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.tableCounts?.expenses ?? 0}
                </p>
              </div>

              <div className="clay-card p-4 rounded-[24px]">
                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Budgets</p>
                <p
                  className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.tableCounts?.budgets ?? 0}
                </p>
              </div>

              <div className="clay-card p-4 rounded-[24px]">
                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Loans</p>
                <p
                  className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.tableCounts?.loans ?? 0}
                </p>
              </div>

              <div className="clay-card p-4 rounded-[24px]">
                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Settlements</p>
                <p
                  className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.tableCounts?.settlements ?? 0}
                </p>
              </div>

              <div className="clay-card p-4 rounded-[24px] bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg">
                <p className="text-[11px] font-bold text-violet-200 uppercase">Total Rows</p>
                <p
                  className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.tableCounts?.totalRecords ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Server Runtime Environment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="clay-card p-6 rounded-[28px] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 clay-orb flex items-center justify-center text-white shrink-0">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block">
                  Node &amp; Runtime
                </span>
                <p
                  className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.runtime?.nodeVersion || 'Node.js'} • {health.runtime?.environment || 'production'}
                </p>
              </div>
            </div>

            <div className="clay-card p-6 rounded-[28px] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 clay-orb flex items-center justify-center text-white shrink-0">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block">
                  Heap Memory Usage
                </span>
                <p
                  className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {health.runtime?.memoryUsage?.heapUsedMb || '—'} MB /{' '}
                  {health.runtime?.memoryUsage?.heapTotalMb || '—'} MB
                </p>
              </div>
            </div>

            <div className="clay-card p-6 rounded-[28px] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 clay-orb flex items-center justify-center text-white shrink-0">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block">
                  Server Uptime
                </span>
                <p
                  className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5 tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
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
