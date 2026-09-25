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
  Sparkles,
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
      <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] clay-orb flex items-center justify-center text-white shrink-0">
            <HandCoins className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="clay-badge-pill bg-[#0EA5E9]/10 text-[#0284C7] dark:text-[#38BDF8] border border-[#0EA5E9]/20 text-xs font-bold">
                Peer Ledger
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">Lending &amp; Debts</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Peer Debt &amp; Lending
            </h1>
          </div>
        </div>

        <button
          onClick={openAddLoanModal}
          className="clay-btn-primary px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white self-stretch sm:self-auto cursor-pointer"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>Record Peer Loan</span>
        </button>
      </div>

      {/* ALERTS */}
      {successMsg && (
        <div className="clay-card p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-between animate-scaleIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="clay-card p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center justify-between animate-scaleIn">
          <span>{error}</span>
          <button onClick={() => setError('')} className="p-1 rounded-lg hover:bg-rose-500/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. RECEIVABLE VS PAYABLE DUAL TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Receivable (Lent) */}
        <div className="clay-card p-6 sm:p-7 relative overflow-hidden group">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--clay-border)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 clay-orb flex items-center justify-center text-white">
                <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-[var(--text-secondary)]">
                Outstanding Receivable
              </span>
            </div>
            <span className="clay-badge-pill bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              To Receive
            </span>
          </div>
          <div
            className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight my-2"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {formatCurrency(summary.totalReceivable)}
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Total capital lent out and owed to you by contacts
          </p>
        </div>

        {/* Payable (Borrowed) */}
        <div className="clay-card p-6 sm:p-7 relative overflow-hidden group">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--clay-border)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 clay-orb flex items-center justify-center text-white">
                <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-[var(--text-secondary)]">
                Outstanding Payable
              </span>
            </div>
            <span className="clay-badge-pill bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold">
              To Repay
            </span>
          </div>
          <div
            className="text-3xl sm:text-5xl font-black text-rose-600 dark:text-rose-400 tracking-tight my-2"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {formatCurrency(summary.totalPayable)}
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Total debt obligations you have borrowed and need to return
          </p>
        </div>
      </div>

      {/* 3. TABS & FILTER TOOLBAR */}
      <div className="space-y-6">
        <div className="clay-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-muted)] clay-sunken">
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'loans'
                  ? 'bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white clay-pill shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Active Ledgers ({loans.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white clay-pill shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Directory ({contacts.length})
            </button>
          </div>

          {activeTab === 'loans' && (
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="clay-input py-2.5 px-4 text-xs font-bold rounded-2xl cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="LENT">Lent (Receivable)</option>
                <option value="BORROWED">Borrowed (Payable)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="clay-input py-2.5 px-4 text-xs font-bold rounded-2xl cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="SETTLED">Settled</option>
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
          <div className="clay-card p-12 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-violet-100 dark:bg-violet-900/30 clay-orb flex items-center justify-center text-violet-500 mx-auto">
              <Receipt className="h-8 w-8" />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[var(--text-primary)]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                No Peer Ledgers Found
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                No recorded lending or borrowing entries match your filters.
              </p>
            </div>
            <button
              onClick={openAddLoanModal}
              className="clay-btn-primary px-6 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2 text-white cursor-pointer"
              style={{ fontFamily: 'Nunito, sans-serif' }}
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
