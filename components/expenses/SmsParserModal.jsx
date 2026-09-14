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
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { parseBulkSms, parseSingleSms } from '@/lib/smsParser';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#EAE6DF] rounded-3xl p-5 sm:p-7 shadow-[10px_10px_30px_rgba(168,160,146,0.5),-10px_-10px_30px_rgba(255,255,255,0.9)] max-h-[90vh] flex flex-col space-y-4 animate-scaleIn">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DFDBD3]/50">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl neu-inset flex items-center justify-center text-[#0047FF]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E2025]">
                Smart SMS & UPI Auto-Parser
              </h2>
              <p className="text-[10px] text-[#7D8494]">
                Paste your bank transaction SMS or UPI alerts to auto-detect and log expenses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7D8494] hover:text-[#1E2025] cursor-pointer neu-btn-sm rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CLIPBOARD & ACTION HEADER */}
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494]">
            Paste Bank SMS / UPI Alert:
          </label>
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="neu-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0047FF] cursor-pointer"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            <span>Paste from Clipboard</span>
          </button>
        </div>

        {/* INPUT TEXTAREA */}
        <div className="space-y-1">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => handleParseText(e.target.value)}
            placeholder="Paste single or multiple bank SMS here... (e.g. 'Sent Rs. 450 to Swiggy via UPI...')"
            className="neu-input w-full p-3 text-xs text-[#1E2025] focus:outline-none resize-none font-mono"
          />
        </div>

        {/* STATUS NOTICES */}
        {errorMessage && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-100/80 text-rose-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* PARSED EXPENSES LIST */}
        <div className="flex-1 overflow-y-auto max-h-60 space-y-2.5 pr-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#7D8494] px-1">
            <span>Detected Transactions ({parsedItems.length})</span>
            {parsedItems.length > 0 && (
              <span className="text-[#0047FF]">
                Total: {formatCurrency(parsedItems.reduce((acc, i) => acc + (Number(i.amount) || 0), 0))}
              </span>
            )}
          </div>

          {parsedItems.length === 0 ? (
            <div className="neu-card p-6 text-center text-xs text-[#7D8494] space-y-1">
              <p className="font-semibold text-[#1E2025]">No transactions parsed yet</p>
              <p className="text-[11px]">
                Paste your bank debit SMS or click &quot;Paste from Clipboard&quot; above.
              </p>
            </div>
          ) : (
            parsedItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="neu-card p-3 rounded-2xl space-y-2 text-xs transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Amount Input */}
                  <div className="flex items-center gap-1 font-bold text-sm text-[#1E2025]">
                    <span>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => handleUpdateItem(idx, 'amount', parseFloat(e.target.value) || 0)}
                      className="neu-input py-0.5 px-2 w-24 text-xs font-bold text-[#1E2025] focus:outline-none"
                    />
                  </div>

                  {/* Payment Method Badge */}
                  <span className="neu-inset px-2 py-0.5 rounded-md text-[10px] font-bold text-[#7D8494]">
                    {item.paymentMethod.replace('_', ' ')}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                    title="Remove this item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Merchant / Description */}
                  <div>
                    <label className="block text-[9px] font-bold text-[#7D8494] uppercase mb-0.5">
                      Description / Merchant
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                      className="neu-input w-full py-1 px-2 text-xs text-[#1E2025] focus:outline-none"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[9px] font-bold text-[#7D8494] uppercase mb-0.5">
                      Category
                    </label>
                    <select
                      value={item.categoryId}
                      onChange={(e) => handleUpdateItem(idx, 'categoryId', parseInt(e.target.value))}
                      className="neu-input w-full py-1 px-2 text-xs text-[#1E2025] focus:outline-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="pt-2 border-t border-[#DFDBD3]/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="neu-btn px-4 py-2 text-xs font-semibold text-[#7D8494] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={parsedItems.length === 0 || isSubmitting}
            onClick={handleSaveAll}
            className="neu-btn-blue inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Logging Transactions...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  Log All {parsedItems.length} Expense{parsedItems.length !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
