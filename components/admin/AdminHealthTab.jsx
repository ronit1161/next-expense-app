import { Activity, RefreshCw, Server, HardDrive, Cpu, Loader2 } from 'lucide-react';

export default function AdminHealthTab({
  health,
  loadingHealth,
  pingingDb,
  handlePingDb,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {loadingHealth ? (
        <div className="neu-card p-12 rounded-2xl flex flex-col items-center justify-center text-pencil">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
          <p className="text-xs font-semibold">Running database & server diagnostics...</p>
        </div>
      ) : health ? (
        <>
          {/* Vitals Summary Card */}
          <div className="neu-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-200/60 bg-gradient-to-r from-[#EAE6DF] via-emerald-50/20 to-[#EAE6DF]">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${
                  health.status === 'HEALTHY'
                    ? 'bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.35)]'
                    : 'bg-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.35)]'
                }`}
              >
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-charcoal">
                    PostgreSQL Database Connection
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                      health.status === 'HEALTHY'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {health.status}
                  </span>
                </div>
                <p className="text-xs text-pencil mt-0.5">
                  Neon Serverless Postgres • Measured latency:{' '}
                  <strong className="text-emerald-700 font-bold">
                    {health.databaseLatencyMs} ms
                  </strong>
                </p>
              </div>
            </div>

            <button
              onClick={handlePingDb}
              disabled={pingingDb}
              className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-charcoal flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-emerald-600 ${pingingDb ? 'animate-spin' : ''}`}
              />
              <span>{pingingDb ? 'Pinging DB...' : 'Test DB Latency'}</span>
            </button>
          </div>

          {/* Table Row Statistics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-pencil uppercase tracking-wider">
              Database Table Row Counts
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="neu-card p-4 rounded-xl text-center">
                <p className="text-[10px] text-pencil uppercase font-bold">Users</p>
                <p className="text-lg font-extrabold text-charcoal mt-1">
                  {health.tableCounts?.users ?? 0}
                </p>
              </div>

              <div className="neu-card p-4 rounded-xl text-center">
                <p className="text-[10px] text-pencil uppercase font-bold">Expenses</p>
                <p className="text-lg font-extrabold text-charcoal mt-1">
                  {health.tableCounts?.expenses ?? 0}
                </p>
              </div>

              <div className="neu-card p-4 rounded-xl text-center">
                <p className="text-[10px] text-pencil uppercase font-bold">Budgets</p>
                <p className="text-lg font-extrabold text-charcoal mt-1">
                  {health.tableCounts?.budgets ?? 0}
                </p>
              </div>

              <div className="neu-card p-4 rounded-xl text-center">
                <p className="text-[10px] text-pencil uppercase font-bold">Loans</p>
                <p className="text-lg font-extrabold text-charcoal mt-1">
                  {health.tableCounts?.loans ?? 0}
                </p>
              </div>

              <div className="neu-card p-4 rounded-xl text-center">
                <p className="text-[10px] text-pencil uppercase font-bold">Settlements</p>
                <p className="text-lg font-extrabold text-charcoal mt-1">
                  {health.tableCounts?.settlements ?? 0}
                </p>
              </div>

              <div className="neu-card p-4 rounded-xl text-center bg-blue-50/30 border border-blue-200/50">
                <p className="text-[10px] text-[#0047FF] uppercase font-bold">Total Rows</p>
                <p className="text-lg font-extrabold text-[#0047FF] mt-1">
                  {health.tableCounts?.totalRecords ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Server Runtime Environment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neu-card p-5 rounded-2xl flex items-center gap-3">
              <Server className="h-5 w-5 text-pencil" />
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                  Node Version & Env
                </span>
                <p className="text-xs font-bold text-charcoal mt-0.5">
                  {health.runtime?.nodeVersion} • {health.runtime?.environment}
                </p>
              </div>
            </div>

            <div className="neu-card p-5 rounded-2xl flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-pencil" />
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                  Memory Heap Used
                </span>
                <p className="text-xs font-bold text-charcoal mt-0.5">
                  {health.runtime?.memoryUsage?.heapUsedMb || '—'} MB /{' '}
                  {health.runtime?.memoryUsage?.heapTotalMb || '—'} MB
                </p>
              </div>
            </div>

            <div className="neu-card p-5 rounded-2xl flex items-center gap-3">
              <Cpu className="h-5 w-5 text-pencil" />
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                  Server Uptime
                </span>
                <p className="text-xs font-bold text-charcoal mt-0.5">
                  {Math.floor((health.runtime?.uptimeSeconds || 0) / 60)} minutes (
                  {health.runtime?.uptimeSeconds || 0}s)
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
