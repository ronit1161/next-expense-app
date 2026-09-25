'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  CreditCard,
  RefreshCw,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Wallet,
  HandCoins,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  getLoansAction,
  getContactsAction,
  getLoanDetailsAction,
  createLoanAction,
  recordSettlementAction,
  deleteLoanAction,
} from '@/actions/loan-actions';
import { DebtsLedgerSkeleton } from '@/components/ui/skeletons';
import DebtCard from '@/components/debts/DebtCard';
import AddLoanModal from '@/components/debts/AddLoanModal';
import SettlementModal from '@/components/debts/SettlementModal';
import ContactsDirectoryTab from '@/components/debts/ContactsDirectoryTab';

export default function DebtsPage() {
  const [loans, setLoans] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [summary, setSummary] = useState({ totalReceivable: 0, totalPayable: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [activeTab, setActiveTab] = useState('loans');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Create Loan Modal
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [loanType, setLoanType] = useState('LENT');
  const [amount, setAmount] = useState('');
  const [loanDate, setLoanDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [loanSaving, setLoanSaving] = useState(false);
  const [loanError, setLoanError] = useState('');

  // Settlement Modal
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [settlementDate, setSettlementDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [settlementHistory, setSettlementHistory] = useState([]);
  const [settleSaving, setSettleSaving] = useState(false);
  const [settleError, setSettleError] = useState('');

  const fetchLedgerData = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const [loansRes, contactsRes] = await Promise.all([
        getLoansAction({
          type: typeFilter || undefined,
          status: statusFilter || undefined,
        }),
        getContactsAction(),
      ]);

      if (loansRes.success) {
        setLoans(loansRes.loans);
        setSummary(loansRes.summary);
      }
      if (contactsRes.success) {
        setContacts(contactsRes.contacts);
      }
    } catch (err) {
      setError('Failed to fetch peer ledgers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    fetchLedgerData();
  }, [fetchLedgerData]);

  // Modal Openers
  const openAddLoanModal = () => {
    setContactName('');
    setLoanType('LENT');
    setAmount('');
    setLoanDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setDescription('');
    setLoanError('');
    setIsLoanModalOpen(true);
  };

  const closeAddLoanModal = () => {
    setIsLoanModalOpen(false);
    setLoanError('');
  };

  const openSettlementModal = async (loan) => {
    setSelectedLoan(loan);
    setSettleAmount(String(loan.remainingAmount));
    setPaymentMethod('UPI');
    setSettlementDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setSettleError('');
    setIsSettlementModalOpen(true);

    try {
      const details = await getLoanDetailsAction(loan.id);
      if (details.success) {
        setSettlementHistory(details.settlements);
      }
    } catch (err) {
      console.error('Failed to load settlement history', err);
    }
  };

  const closeSettlementModal = () => {
    setIsSettlementModalOpen(false);
    setSelectedLoan(null);
    setSettlementHistory([]);
    setSettleError('');
  };

  // Submit Handlers
  const handleSaveLoan = async (e) => {
    e.preventDefault();
    setLoanError('');

    if (!contactName.trim()) {
      setLoanError('Please specify a contact name.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setLoanError('Please specify a valid loan amount.');
      return;
    }

    setLoanSaving(true);
    try {
      const res = await createLoanAction({
        contactName: contactName.trim(),
        type: loanType,
        amount: Number(amount),
        loanDate,
        dueDate: dueDate || undefined,
        description: description.trim() || undefined,
      });

      if (res.success) {
        setSuccessMsg('Peer loan record successfully saved!');
        setTimeout(() => setSuccessMsg(''), 3500);
        closeAddLoanModal();
        fetchLedgerData();
      } else {
        setLoanError(res.error || 'Failed to create loan record.');
      }
    } catch (err) {
      setLoanError(err.message || 'Operation failed.');
    } finally {
      setLoanSaving(false);
    }
  };

  const handleRecordSettlement = async (e) => {
    e.preventDefault();
    setSettleError('');

    if (!settleAmount || Number(settleAmount) <= 0) {
      setSettleError('Please enter a valid repayment amount.');
      return;
    }
    if (Number(settleAmount) > selectedLoan.remainingAmount) {
      setSettleError(`Amount cannot exceed outstanding balance of ${formatCurrency(selectedLoan.remainingAmount)}`);
      return;
    }

    setSettleSaving(true);
    try {
      const res = await recordSettlementAction({
        loanId: selectedLoan.id,
        amount: Number(settleAmount),
        paymentMethod,
        settlementDate,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        setSuccessMsg('Repayment recorded & audited successfully!');
        setTimeout(() => setSuccessMsg(''), 3500);
        closeSettlementModal();
        fetchLedgerData();
      } else {
        setSettleError(res.error || 'Failed to record settlement.');
      }
    } catch (err) {
      setSettleError(err.message || 'Operation failed.');
    } finally {
      setSettleSaving(false);
    }
  };

  const handleDeleteLoan = async (id) => {
    if (!confirm('Are you sure you want to remove this peer loan record?')) return;
    try {
      const res = await deleteLoanAction(id);
      if (res.success) {
        setSuccessMsg('Peer loan record deleted.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchLedgerData();
      } else {
        alert(res.error || 'Failed to delete loan.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete loan.');
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold mb-1">
            <HandCoins className="h-3.5 w-3.5" />
            <span>Peer Ledger &bull; Lending &amp; Borrowing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Peer Debt &amp; Lending
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track money lent out to peers and obligations you need to settle.
          </p>
        </div>

        <button
          onClick={openAddLoanModal}
          className="fintech-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Record Peer Loan</span>
        </button>
      </div>

      {/* ALERTS */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-between rounded-2xl animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 rounded-lg hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-between rounded-2xl animate-fadeIn">
          <span>{error}</span>
          <button onClick={() => setError('')} className="p-1 rounded-lg hover:bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. RECEIVABLE VS PAYABLE DUAL TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Receivable (Lent) */}
        <div className="fintech-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Outstanding Receivable
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
              To Receive
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight my-1 tabular-nums">
            {formatCurrency(summary.totalReceivable)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total capital lent out and owed to you by contacts
          </p>
        </div>

        {/* Payable (Borrowed) */}
        <div className="fintech-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ArrowDownLeft className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Outstanding Payable
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-bold">
              To Repay
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight my-1 tabular-nums">
            {formatCurrency(summary.totalPayable)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total debt obligations you have borrowed and need to return
          </p>
        </div>
      </div>

      {/* 3. TABS & FILTER TOOLBAR */}
      <div className="space-y-6">
        <div className="fintech-card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'loans'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active Ledgers ({loans.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Directory ({contacts.length})
            </button>
          </div>

          {activeTab === 'loans' && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
              >
                <option value="" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">All Types</option>
                <option value="LENT" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Lent (Receivable)</option>
                <option value="BORROWED" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Borrowed (Payable)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
              >
                <option value="" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">All Statuses</option>
                <option value="PENDING" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Pending</option>
                <option value="PARTIAL" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Partial</option>
                <option value="SETTLED" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Settled</option>
              </select>
            </div>
          )}
        </div>

        {/* 4. CONTENT VIEW */}
        {loading ? (
          <DebtsLedgerSkeleton />
        ) : activeTab === 'contacts' ? (
          <ContactsDirectoryTab contacts={contacts} />
        ) : loans.length === 0 ? (
          <div className="fintech-card p-12 text-center space-y-4 rounded-3xl">
            <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
              <Receipt className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Peer Ledgers Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No recorded lending or borrowing entries match your filters.
              </p>
            </div>
            <button
              onClick={openAddLoanModal}
              className="fintech-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Log First Peer Loan</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <DebtCard
                key={loan.id}
                loan={loan}
                onOpenSettlement={openSettlementModal}
                onDelete={handleDeleteLoan}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <AddLoanModal
        isOpen={isLoanModalOpen}
        onClose={closeAddLoanModal}
        loanType={loanType}
        setLoanType={setLoanType}
        contactName={contactName}
        setContactName={setContactName}
        amount={amount}
        setAmount={setAmount}
        loanDate={loanDate}
        setLoanDate={setLoanDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        description={description}
        setDescription={setDescription}
        loanError={loanError}
        loanSaving={loanSaving}
        onSave={handleSaveLoan}
      />

      <SettlementModal
        isOpen={isSettlementModalOpen}
        onClose={closeSettlementModal}
        selectedLoan={selectedLoan}
        settleAmount={settleAmount}
        setSettleAmount={setSettleAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        settlementDate={settlementDate}
        setSettlementDate={setSettlementDate}
        notes={notes}
        setNotes={setNotes}
        settlementHistory={settlementHistory}
        settleSaving={settleSaving}
        settleError={settleError}
        onRecordSettlement={handleRecordSettlement}
      />
    </div>
  );
}
