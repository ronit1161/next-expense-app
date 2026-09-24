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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-2xl border-4 border-black dark:border-white bg-[var(--bg-surface)] p-6 space-y-4 max-h-[90vh] flex flex-col animate-scaleIn">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-4 bg-[#FF3000] inline-block"></span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                02.SMS // BATCH INGESTION
              </span>
              <h3 className="text-lg font-black uppercase text-charcoal">
                PARSER &amp; TRANSACTION EXTRACTOR
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-black dark:border-white text-pencil hover:text-charcoal cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ALERTS */}
        {successMessage && (
          <div className="border-2 border-black bg-black text-white p-3 text-xs font-black uppercase flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#FF3000]" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="border-2 border-[#FF3000] bg-[#FF3000]/10 p-3 text-xs font-black text-[#FF3000] uppercase flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* INPUT TEXTAREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal">
              PASTE BANK SMS / TRANSACTION NOTIFICATIONS:
            </label>
            <button
              onClick={handlePasteFromClipboard}
              className="swiss-btn px-2.5 py-1 text-[10px] font-black flex items-center gap-1"
            >
              <ClipboardPaste className="h-3 w-3" />
              <span>PASTE CLIPBOARD</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => handleParseText(e.target.value)}
            placeholder="Paste raw bank alert text here (e.g. Sent Rs.450.00 to SWIGGY on 24-Sep-26 via UPI...)"
            className="swiss-input w-full p-3 text-xs font-mono"
          />
        </div>

        {/* PARSED TABLE */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-56 border-2 border-black dark:border-white/20 p-2 bg-[var(--bg-subtle)]">
          <div className="flex items-center justify-between pb-1 border-b border-black/10 dark:border-white/10">
            <span className="text-[10px] font-black uppercase text-pencil">
              PARSED ENTRIES ({parsedItems.length})
            </span>
          </div>

          {parsedItems.length === 0 ? (
            <p className="text-xs font-mono text-pencil p-4 text-center uppercase">
              NO DETECTABLE TRANSACTION PATTERNS FOUND
            </p>
          ) : (
            parsedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 border border-black/20 dark:border-white/20 bg-[var(--bg-surface)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-charcoal">
                      ₹{item.amount}
                    </span>
                    <span className="text-[10px] font-mono text-pencil uppercase truncate max-w-[140px]">
                      {item.merchant || 'EXPENSE'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono border border-current px-1 uppercase">
                    {item.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.categoryId || (categories[0]?.id ? String(categories[0].id) : '')}
                    onChange={(e) => handleUpdateItem(idx, 'categoryId', e.target.value)}
                    className="swiss-input py-1 px-2 text-[10px] font-mono font-bold uppercase"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-pencil hover:text-[#FF3000] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUBMIT ACTION */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black dark:border-white/20">
          <button onClick={onClose} className="swiss-btn px-4 py-2 text-xs font-black">
            CANCEL
          </button>
          <button
            onClick={handleSaveAll}
            disabled={parsedItems.length === 0 || isSubmitting}
            className="swiss-btn-accent px-5 py-2 text-xs font-black disabled:opacity-40"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `COMMIT ${parsedItems.length} TRANSACTIONS`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
