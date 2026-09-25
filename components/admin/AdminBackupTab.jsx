import { Database, FileSpreadsheet, Download, CheckCircle2, Loader2 } from 'lucide-react';

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
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-2.5 rounded-2xl animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Database Snapshot JSON */}
        <div className="fintech-card p-6 sm:p-7 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                  Full Platform Snapshot
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  JSON Archive Backup
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Downloads a complete structured JSON archive for off-site backup, disaster
              recovery, or database migrations. Sensitive fields (like password hashes) are
              securely omitted from platform exports.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={downloadingBackup}
            className="fintech-btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fintech-card p-6 sm:p-7 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                  Transactional Audit Stream
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Master Platform CSV Ledger
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={csvStartDate}
                  onChange={(e) => setCsvStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={csvEndDate}
                  onChange={(e) => setCsvEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadMasterCsv}
            disabled={downloadingCsv}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {downloadingCsv ? (
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            )}
            <span>{downloadingCsv ? 'Compiling CSV...' : 'Export Master CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
