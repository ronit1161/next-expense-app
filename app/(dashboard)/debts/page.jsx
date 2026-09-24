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
      setLoanError('PLEASE SPECIFY A CONTACT NAME.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setLoanError('PLEASE SPECIFY A VALID LOAN AMOUNT.');
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
        setSuccessMsg('PEER LEDGER RECORD LOGGED');
        setTimeout(() => setSuccessMsg(''), 3000);
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
      setSettleError('PLEASE ENTER A VALID REPAYMENT AMOUNT.');
      return;
    }
    if (Number(settleAmount) > selectedLoan.remainingAmount) {
      setSettleError(`AMOUNT CANNOT EXCEED OUTSTANDING ${formatCurrency(selectedLoan.remainingAmount)}`);
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
        setSuccessMsg('SETTLEMENT AUDITED & LOGGED');
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
    if (!confirm('CONFIRM DELETE: Remove this peer loan ledger record?')) return;
    try {
      const res = await deleteLoanAction(id);
      if (res.success) {
        setSuccessMsg('LEDGER RECORD DELETED');
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
      <div className="border-b-4 border-black dark:border-white/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 bg-[#FF3000]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                05. PEER LEDGERS // LENDING &amp; EXPOSURE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-charcoal">
              PEER DEBT &amp; LENDING
            </h1>
          </div>

          <button
            onClick={openAddLoanModal}
            className="swiss-btn-accent px-4 py-2 text-xs font-black flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>RECORD PEER LOAN</span>
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {successMsg && (
        <div className="border-2 border-black bg-black text-white p-3 text-xs font-black uppercase tracking-wider animate-fadeIn flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="border-2 border-[#FF3000] bg-[#FF3000]/10 text-[#FF3000] p-3 text-xs font-black uppercase tracking-wider animate-fadeIn">
          {error}
        </div>
      )}

      {/* 2. RECEIVABLE VS PAYABLE DUAL TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Receivable (Lent) */}
        <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-2">
            <span className="text-xs font-black uppercase tracking-widest text-charcoal">
              05.A OUTSTANDING RECEIVABLE (LENT OUT)
            </span>
            <span className="text-[10px] font-mono px-1 border border-black dark:border-white uppercase font-bold">
              TO RECEIVE
            </span>
          </div>
          <div className="text-3xl sm:text-5xl font-black text-charcoal tabular-nums font-mono pt-2">
            {formatCurrency(summary.totalReceivable)}
          </div>
          <p className="text-[10px] font-mono text-pencil uppercase pt-1">
            AGGREGATE CAPITAL OWED TO YOU BY RECIPIENTS
          </p>
        </div>

        {/* Payable (Borrowed) */}
        <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF3000]">
              05.B OUTSTANDING PAYABLE (BORROWED)
            </span>
            <span className="text-[10px] font-mono px-1 bg-[#FF3000] text-white uppercase font-bold">
              TO REPAY
            </span>
          </div>
          <div className="text-3xl sm:text-5xl font-black text-[#FF3000] tabular-nums font-mono pt-2">
            {formatCurrency(summary.totalPayable)}
          </div>
          <p className="text-[10px] font-mono text-pencil uppercase pt-1">
            AGGREGATE OBLIGATION YOU OWE TO LENDERS
          </p>
        </div>
      </div>

      {/* 3. TABS & FILTER TOOLBAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black dark:border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-4 py-2 text-xs font-black uppercase border-2 transition-all cursor-pointer ${
                activeTab === 'loans'
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black dark:border-white/30 text-charcoal hover:bg-black hover:text-white'
              }`}
            >
              ACTIVE LEDGERS ({loans.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2 text-xs font-black uppercase border-2 transition-all cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black dark:border-white/30 text-charcoal hover:bg-black hover:text-white'
              }`}
            >
              DIRECTORY ({contacts.length})
            </button>
          </div>

          {activeTab === 'loans' && (
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="swiss-input py-1.5 px-2.5 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                <option value="">ALL TYPES</option>
                <option value="LENT">LENT (RECEIVABLE)</option>
                <option value="BORROWED">BORROWED (PAYABLE)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="swiss-input py-1.5 px-2.5 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                <option value="">ALL STATUSES</option>
                <option value="PENDING">PENDING</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="SETTLED">SETTLED</option>
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
          <div className="border-4 border-black dark:border-white/20 p-8 sm:p-12 text-center space-y-4 bg-[var(--bg-surface)]">
            <CreditCard className="h-8 w-8 text-pencil mx-auto" />
            <div>
              <h3 className="text-sm font-black uppercase text-charcoal">
                NO PEER LEDGERS FOUND
              </h3>
              <p className="text-xs font-mono text-pencil mt-1 max-w-xs mx-auto uppercase">
                NO RECORDED LENDING OR DEBT ENTRIES MATCHING CRITERIA.
              </p>
            </div>
            <button
              onClick={openAddLoanModal}
              className="swiss-btn-accent px-4 py-2.5 text-xs font-black uppercase cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1 stroke-[3]" />
              <span>LOG FIRST PEER LOAN</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
