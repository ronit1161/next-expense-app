import { Database, FileSpreadsheet, Download, CheckCircle2, Loader2, Calendar } from 'lucide-react';

export default function AdminBackupTab({
  exportSuccessMsg,
  downloadingBackup,
  handleDownloadBackup,
  downloadingCsv,
  handleDownloadMasterCsv,
  csvStartDate,
  setCsvStartDate,
  csvEndDate,
  setCsvEndDate,
}) {
  return (
    <div className="space-y-6">
      {exportSuccessMsg && (
        <div className="clay-card p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2.5 animate-scaleIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Database Snapshot JSON */}
        <div className="clay-card p-6 sm:p-8 rounded-[32px] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 clay-orb flex items-center justify-center text-white shrink-0">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  Full Platform Snapshot
                </span>
                <h3
                  className="text-lg font-black text-[var(--text-primary)]"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  JSON Archive Backup
                </h3>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Downloads a complete structured JSON archive for off-site backup, disaster
              recovery, or database migrations. Sensitive fields (like password hashes) are
              securely omitted from platform exports.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={downloadingBackup}
            className="clay-btn-primary w-full py-3.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {downloadingBackup ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4 stroke-[2.5]" />
            )}
            <span>{downloadingBackup ? 'Generating Snapshot...' : 'Download JSON Backup'}</span>
          </button>
        </div>

        {/* Master CSV Ledger Export */}
        <div className="clay-card p-6 sm:p-8 rounded-[32px] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 clay-orb flex items-center justify-center text-white shrink-0">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Transactional Audit Stream
                </span>
                <h3
                  className="text-lg font-black text-[var(--text-primary)]"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Master Platform CSV Ledger
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={csvStartDate}
                  onChange={(e) => setCsvStartDate(e.target.value)}
                  className="clay-input w-full px-3 py-2.5 text-xs font-semibold rounded-2xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={csvEndDate}
                  onChange={(e) => setCsvEndDate(e.target.value)}
                  className="clay-input w-full px-3 py-2.5 text-xs font-semibold rounded-2xl"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadMasterCsv}
            disabled={downloadingCsv}
            className="clay-btn-secondary w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {downloadingCsv ? (
              <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-violet-500" />
            )}
            <span>{downloadingCsv ? 'Compiling CSV...' : 'Export Master CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
