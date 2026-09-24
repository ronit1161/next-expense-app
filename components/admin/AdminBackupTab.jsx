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
        <div className="p-4 rounded-none bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white font-mono text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-swiss-red" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Database Snapshot JSON */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 rounded-none space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-none bg-black text-white dark:bg-white dark:text-black">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                  Full JSON Platform Snapshot
                </h3>
                <p className="font-mono text-[11px] text-neutral-500 uppercase">
                  COMPLETE DATABASE BACKUP (.JSON)
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-2 leading-relaxed">
              Downloads a complete structured JSON archive for off-site backup, disaster
              recovery, or database migrations. Sensitive fields (like password hashes) are
              securely omitted from platform exports.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={downloadingBackup}
            className="swiss-btn-primary w-full py-3.5 rounded-none font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            {downloadingBackup ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{downloadingBackup ? 'GENERATING_SNAPSHOT...' : 'DOWNLOAD JSON BACKUP'}</span>
          </button>
        </div>

        {/* Master CSV Ledger Export */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 rounded-none space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-none bg-black text-white dark:bg-white dark:text-black">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                  Master Platform CSV Ledger
                </h3>
                <p className="font-mono text-[11px] text-neutral-500 uppercase">
                  TRANSACTIONAL AUDIT STREAM (.CSV)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                  START DATE
                </label>
                <input
                  type="date"
                  value={csvStartDate}
                  onChange={(e) => setCsvStartDate(e.target.value)}
                  className="swiss-input w-full px-3 py-2 text-xs font-mono rounded-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                  END DATE
                </label>
                <input
                  type="date"
                  value={csvEndDate}
                  onChange={(e) => setCsvEndDate(e.target.value)}
                  className="swiss-input w-full px-3 py-2 text-xs font-mono rounded-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadMasterCsv}
            disabled={downloadingCsv}
            className="swiss-btn-outline w-full py-3.5 rounded-none font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            {downloadingCsv ? (
              <Loader2 className="h-4 w-4 animate-spin text-swiss-red" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            <span>{downloadingCsv ? 'COMPILING_CSV...' : 'EXPORT MASTER CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
