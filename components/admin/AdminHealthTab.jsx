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
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-12 text-center rounded-none">
          <Loader2 className="h-8 w-8 animate-spin text-swiss-red mx-auto mb-3" />
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            [01] RUNNING DATABASE & SERVER DIAGNOSTICS...
          </p>
        </div>
      ) : health ? (
        <>
          {/* Vitals Summary Card */}
          <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-none font-mono text-lg font-black text-white ${
                  health.status === 'HEALTHY'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-swiss-red text-white'
                }`}
              >
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                    PostgreSQL Connection Matrix
                  </h3>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 font-bold uppercase rounded-none border ${
                      health.status === 'HEALTHY'
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'bg-swiss-red text-white border-swiss-red'
                    }`}
                  >
                    STATUS: {health.status}
                  </span>
                </div>
                <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Engine: Neon Serverless Postgres // Latency:{' '}
                  <strong className="text-black dark:text-white font-black">
                    {health.databaseLatencyMs} ms
                  </strong>
                </p>
              </div>
            </div>

            <button
              onClick={handlePingDb}
              disabled={pingingDb}
              className="swiss-btn-outline px-5 py-3 rounded-none font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${pingingDb ? 'animate-spin text-swiss-red' : ''}`}
              />
              <span>{pingingDb ? 'PINGING_DB...' : 'TEST DB LATENCY'}</span>
            </button>
          </div>

          {/* Table Row Statistics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-neutral-500">
                [02] DATABASE ROW TELEMETRY
              </h3>
              <span className="font-mono text-[10px] uppercase text-neutral-400">
                LIVE_SCHEMA_COUNT
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-4 rounded-none">
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">USERS</p>
                <p className="font-mono text-xl font-black text-black dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.users ?? 0}
                </p>
              </div>

              <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-4 rounded-none">
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">EXPENSES</p>
                <p className="font-mono text-xl font-black text-black dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.expenses ?? 0}
                </p>
              </div>

              <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-4 rounded-none">
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">BUDGETS</p>
                <p className="font-mono text-xl font-black text-black dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.budgets ?? 0}
                </p>
              </div>

              <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-4 rounded-none">
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">LOANS</p>
                <p className="font-mono text-xl font-black text-black dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.loans ?? 0}
                </p>
              </div>

              <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-4 rounded-none">
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">SETTLEMENTS</p>
                <p className="font-mono text-xl font-black text-black dark:text-white mt-1 tabular-nums">
                  {health.tableCounts?.settlements ?? 0}
                </p>
              </div>

              <div className="border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black p-4 rounded-none">
                <p className="font-mono text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-bold">TOTAL ROWS</p>
                <p className="font-mono text-xl font-black mt-1 tabular-nums">
                  {health.tableCounts?.totalRecords ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Server Runtime Environment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 rounded-none flex items-center gap-3">
              <div className="p-2 border border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 rounded-none">
                <Server className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  NODE & ENVIRONMENT
                </span>
                <p className="font-mono text-xs font-black text-black dark:text-white mt-0.5">
                  {health.runtime?.nodeVersion || 'Node.js'} • {health.runtime?.environment || 'production'}
                </p>
              </div>
            </div>

            <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 rounded-none flex items-center gap-3">
              <div className="p-2 border border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 rounded-none">
                <HardDrive className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  HEAP MEMORY USAGE
                </span>
                <p className="font-mono text-xs font-black text-black dark:text-white mt-0.5 tabular-nums">
                  {health.runtime?.memoryUsage?.heapUsedMb || '—'} MB /{' '}
                  {health.runtime?.memoryUsage?.heapTotalMb || '—'} MB
                </p>
              </div>
            </div>

            <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 rounded-none flex items-center gap-3">
              <div className="p-2 border border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 rounded-none">
                <Cpu className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                  SERVER UPTIME
                </span>
                <p className="font-mono text-xs font-black text-black dark:text-white mt-0.5 tabular-nums">
                  {Math.floor((health.runtime?.uptimeSeconds || 0) / 60)} MIN (
                  {health.runtime?.uptimeSeconds || 0}S)
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
