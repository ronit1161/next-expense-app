'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  CreditCard,
  RefreshCw,
  X,
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
      setLoanError('Please provide a contact person name.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setLoanError('Please enter a valid loan principal amount.');
      return;
    }

    setLoanSaving(true);
    try {
      const payload = {
        contactName: contactName.trim(),
        type: loanType,
        amount: Number(amount),
        loanDate,
        dueDate: dueDate || undefined,
        description: description.trim() || undefined,
      };

      const res = await createLoanAction(payload);
      if (res.success) {
        setSuccessMsg('Peer loan recorded.');
        setTimeout(() => setSuccessMsg(''), 3000);
        closeAddLoanModal();
        fetchLedgerData();
      } else {
        setLoanError(res.error || 'Failed to record loan.');
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
      setSettleError('Please specify a positive settlement amount.');
      return;
    }

    if (Number(settleAmount) > Number(selectedLoan?.remainingAmount)) {
      setSettleError(
        `Settlement amount cannot exceed remaining balance (₹${selectedLoan?.remainingAmount}).`
      );
      return;
    }

    setSettleSaving(true);
    try {
      const payload = {
        amount: Number(settleAmount),
        paymentMethod,
        settlementDate,
        notes: notes || null,
      };

      const res = await recordSettlementAction(selectedLoan.id, payload);
      if (res.success) {
        setSuccessMsg('Settlement logged successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
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
    if (!window.confirm('Permanently remove this peer loan record?')) return;

    try {
      const res = await deleteLoanAction(id);
      if (res.success) {
        setSuccessMsg('Loan record deleted.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchLedgerData();
      } else {
        setError(res.error || 'Failed to delete record.');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete record.');
    }
  };

  const netBalance = summary.totalReceivable - summary.totalPayable;

  if (loading && loans.length === 0) {
    return <DebtsLedgerSkeleton />;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            Peer Registers
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-charcoal tracking-tight mt-0.5">
            Lending & Borrowing
          </h1>
          <p className="text-xs md:text-sm text-pencil mt-1">
            Track receivables, payables, and step-by-step debt repayments.
          </p>
        </div>

        <button
          onClick={openAddLoanModal}
          className="neu-btn-blue inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs md:text-sm font-semibold text-white cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Record Loan</span>
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-emerald-800 dark:text-emerald-400 animate-fadeIn">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-loss animate-fadeIn">
          <span>{error}</span>
          <button
            onClick={() => {
              setLoading(true);
              fetchLedgerData();
            }}
            className="flex items-center gap-1 text-xs underline cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. SUMMARY TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            To Receive (Lent)
          </span>
          <div className="text-2xl font-bold text-gain tabular-nums mt-2">
            {formatCurrency(summary.totalReceivable)}
          </div>
          <p className="text-[11px] text-pencil mt-2">Total pending from contacts</p>
        </div>

        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            To Pay (Borrowed)
          </span>
          <div className="text-2xl font-bold text-loss tabular-nums mt-2">
            {formatCurrency(summary.totalPayable)}
          </div>
          <p className="text-[11px] text-pencil mt-2">Total owed to others</p>
        </div>

        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            Net Balance Exposure
          </span>
          <div
            className={`text-2xl font-bold tabular-nums mt-2 ${
              netBalance >= 0 ? 'text-gain' : 'text-loss'
            }`}
          >
            {formatCurrency(netBalance)}
          </div>
          <p className="text-[11px] text-pencil mt-2">
            {netBalance >= 0 ? 'Net creditor position' : 'Net debtor position'}
          </p>
        </div>
      </div>

      {/* 3. SUB-TAB & FILTER CONTROLS */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <div className="inline-flex rounded-2xl neu-inset p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'loans'
                ? 'neu-card-sm text-[#0047FF] font-bold'
                : 'text-pencil hover:text-charcoal'
            }`}
          >
            All Loans ({loans.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'neu-card-sm text-[#0047FF] font-bold'
                : 'text-pencil hover:text-charcoal'
            }`}
          >
            Contacts Directory ({contacts.length})
          </button>
        </div>

        {activeTab === 'loans' && (
          <div className="flex items-center gap-2.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal cursor-pointer"
            >
              <option value="" className="bg-[var(--bg-main)] text-charcoal">All Types</option>
              <option value="LENT" className="bg-[var(--bg-main)] text-charcoal">Lent Only</option>
              <option value="BORROWED" className="bg-[var(--bg-main)] text-charcoal">Borrowed Only</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal cursor-pointer"
            >
              <option value="" className="bg-[var(--bg-main)] text-charcoal">All Statuses</option>
              <option value="PENDING" className="bg-[var(--bg-main)] text-charcoal">Pending</option>
              <option value="PARTIAL" className="bg-[var(--bg-main)] text-charcoal">Partial</option>
              <option value="SETTLED" className="bg-[var(--bg-main)] text-charcoal">Settled</option>
            </select>
          </div>
        )}
      </div>

      {/* 4. ACTIVE TAB CONTENT */}
      {activeTab === 'loans' ? (
        <div className="space-y-4">
          {loans.length === 0 ? (
            <div className="neu-card p-12 text-center rounded-3xl space-y-4">
              <CreditCard className="h-8 w-8 text-pencil mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-charcoal">NO PEER LOANS RECORDED</h3>
                <p className="text-xs text-pencil mt-1 max-w-xs mx-auto">
                  Keep track of money lent to friends or borrowed from contacts.
                </p>
              </div>
              <button
                onClick={openAddLoanModal}
                className="neu-btn-blue inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Record Loan</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      ) : (
        <ContactsDirectoryTab contacts={contacts} />
      )}

      {/* 5. RECORD LOAN MODAL */}
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

      {/* 6. SETTLEMENT & AUDIT MODAL */}
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
