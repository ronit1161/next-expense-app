'use client';

import { useState } from 'react';
import {
  Sparkles,
  ClipboardPaste,
  CheckCircle2,
  Trash2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { parseBulkSms } from '@/lib/smsParser';
import { createBatchExpensesAction } from '@/actions/expense-actions';
import { formatCurrency } from '@/lib/utils';

export default function SmsParserModal({ isOpen, onClose, categories = [], onBatchCreated }) {
  const [inputText, setInputText] = useState('');
  const [parsedItems, setParsedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleParseText = (text) => {
    setInputText(text);
    if (!text || text.trim().length < 8) {
      setParsedItems([]);
      return;
    }
    const results = parseBulkSms(text);
    setParsedItems(results);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          handleParseText(clipText);
        }
      }
    } catch (err) {
      console.error('Clipboard access denied:', err);
    }
  };

  const handleUpdateItem = (index, field, value) => {
    setParsedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setParsedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (parsedItems.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await createBatchExpensesAction(parsedItems);
      if (res.success) {
        setSuccessMessage(res.message || `Successfully logged ${parsedItems.length} expenses!`);
        if (onBatchCreated) {
          onBatchCreated();
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Failed to save transactions.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving transactions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-clay)] p-6 space-y-4 max-h-[90vh] flex flex-col rounded-3xl shadow-2xl animate-scaleIn">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-clay)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Batch Smart Ingestion
              </span>
              <h3 className="text-base font-heading font-black text-[var(--text-primary)]">
                SMS Transaction Extractor
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-recessed)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ALERTS */}
        {successMessage && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 p-3 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-400 p-3 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* INPUT TEXTAREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Paste Bank SMS or UPI alerts:
            </label>
            <button
              onClick={handlePasteFromClipboard}
              className="fintech-btn-secondary px-2.5 py-1 text-[11px] font-bold flex items-center gap-1.5"
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              <span>Paste Clipboard</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => handleParseText(e.target.value)}
            placeholder="Paste raw bank alert text here (e.g. Rs 450.00 spent on SWIGGY on 24-Sep-26 via UPI...)"
            className="fintech-input w-full p-3 text-xs font-medium rounded-2xl resize-none"
          />
        </div>

        {/* PARSED TABLE */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-52 p-3 rounded-2xl bg-[var(--bg-recessed)] no-scrollbar">
          <div className="flex items-center justify-between pb-1 text-[11px] font-bold text-[var(--text-muted)]">
            <span>Parsed Entries ({parsedItems.length})</span>
          </div>

          {parsedItems.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] p-4 text-center font-medium">
              No detectable transaction patterns found yet. Paste SMS text above!
            </p>
          ) : (
            parsedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-clay)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-[var(--text-primary)]">
                      ₹{item.amount}
                    </span>
                    <span className="text-xs font-medium text-[var(--text-muted)] truncate max-w-[140px]">
                      {item.merchant || 'Expense'}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-recessed)] text-[var(--text-muted)] uppercase">
                    {item.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.categoryId || (categories[0]?.id ? String(categories[0].id) : '')}
                    onChange={(e) => handleUpdateItem(idx, 'categoryId', e.target.value)}
                    className="fintech-input py-1 px-2.5 text-xs font-bold rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 rounded-lg hover:bg-[var(--bg-recessed)] cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUBMIT ACTION */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-clay)]">
          <button onClick={onClose} className="fintech-btn-secondary px-4 py-2 text-xs font-bold">
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            disabled={parsedItems.length === 0 || isSubmitting}
            className="fintech-btn-primary px-5 py-2 text-xs font-bold disabled:opacity-40 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `Log ${parsedItems.length} Transactions`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
