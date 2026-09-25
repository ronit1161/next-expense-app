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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-2xl clay-surface bg-white dark:bg-[#231D35] p-6 sm:p-8 space-y-4 max-h-[90vh] flex flex-col rounded-[36px] shadow-2xl animate-scaleIn">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 text-white flex items-center justify-center clay-orb shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
                Batch Smart Ingestion
              </span>
              <h3 className="text-xl font-heading font-black text-charcoal">
                SMS Transaction Extractor
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-pencil hover:text-charcoal cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ALERTS */}
        {successMessage && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 p-3.5 text-xs font-heading font-black flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 p-3.5 text-xs font-heading font-black flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* INPUT TEXTAREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal">
              Paste Bank SMS or UPI alerts:
            </label>
            <button
              onClick={handlePasteFromClipboard}
              className="clay-btn-secondary px-3 py-1.5 text-xs font-heading font-black rounded-xl flex items-center gap-1.5"
            >
              <ClipboardPaste className="h-3.5 w-3.5 text-purple-600" />
              <span>Paste Clipboard</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => handleParseText(e.target.value)}
            placeholder="Paste raw bank alert text here (e.g. Rs 450.00 spent on SWIGGY on 24-Sep-26 via UPI...)"
            className="clay-input w-full p-3.5 text-xs font-medium rounded-2xl"
          />
        </div>

        {/* PARSED TABLE */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-56 p-3 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C] no-scrollbar">
          <div className="flex items-center justify-between pb-1 text-xs font-heading font-bold text-pencil">
            <span>Parsed Entries ({parsedItems.length})</span>
          </div>

          {parsedItems.length === 0 ? (
            <p className="text-xs text-pencil p-4 text-center font-medium">
              No detectable transaction patterns found yet. Paste SMS text above!
            </p>
          ) : (
            parsedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-[#2B243D] flex items-center justify-between gap-3 text-xs shadow-sm"
              >
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-charcoal">
                      ₹{item.amount}
                    </span>
                    <span className="text-xs font-medium text-pencil truncate max-w-[150px]">
                      {item.merchant || 'Expense'}
                    </span>
                  </div>
                  <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    {item.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.categoryId || (categories[0]?.id ? String(categories[0].id) : '')}
                    onChange={(e) => handleUpdateItem(idx, 'categoryId', e.target.value)}
                    className="clay-input py-1.5 px-3 text-xs font-heading font-bold rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-pencil hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUBMIT ACTION */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/10">
          <button onClick={onClose} className="clay-btn-secondary px-5 py-2.5 text-xs font-heading font-black rounded-2xl">
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            disabled={parsedItems.length === 0 || isSubmitting}
            className="clay-btn-primary px-6 py-2.5 text-xs font-heading font-black rounded-2xl disabled:opacity-40 shadow-md"
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
