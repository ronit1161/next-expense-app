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
    <div className="space-y-6 animate-fadeIn">
      {exportSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Database Snapshot JSON */}
        <div className="neu-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal">
                  Full JSON Platform Snapshot
                </h3>
                <p className="text-[11px] text-pencil">
                  Complete database backup including users, expenses, budgets & loans
                </p>
              </div>
            </div>
            <p className="text-xs text-pencil pt-2">
              Downloads a complete structured JSON archive for off-site backup, disaster
              recovery, or database migrations. Sensitive fields (like password hashes) are
              securely omitted.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={downloadingBackup}
            className="neu-btn-blue w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {downloadingBackup ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{downloadingBackup ? 'Generating Snapshot...' : 'Download JSON Backup'}</span>
          </button>
        </div>

        {/* Master CSV Ledger Export */}
        <div className="neu-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-[#0047FF]">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal">
                  Master Platform CSV Ledger
                </h3>
                <p className="text-[11px] text-pencil">
                  Export all user transactions with user attribution & category metadata
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase">
                  Start Date
                </label>
                <input
                  type="date"
                  value={csvStartDate}
                  onChange={(e) => setCsvStartDate(e.target.value)}
                  className="neu-input w-full px-3 py-1.5 text-xs text-charcoal rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase">End Date</label>
                <input
                  type="date"
                  value={csvEndDate}
                  onChange={(e) => setCsvEndDate(e.target.value)}
                  className="neu-input w-full px-3 py-1.5 text-xs text-charcoal rounded-lg mt-1"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadMasterCsv}
            disabled={downloadingCsv}
            className="neu-btn w-full py-3 rounded-xl text-xs font-bold text-charcoal flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {downloadingCsv ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#0047FF]" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-[#0047FF]" />
            )}
            <span>{downloadingCsv ? 'Compiling CSV...' : 'Export Master CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
