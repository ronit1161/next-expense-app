'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  History,
  X,
  CreditCard,
  RefreshCw,
  Users2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  getLoansAction,
  getContactsAction,
  getLoanDetailsAction,
  createLoanAction,
  recordSettlementAction,
  deleteLoanAction,
} from '@/actions/loan-actions';
import { DebtsLedgerSkeleton } from '@/components/ui/skeletons';

const PAYMENT_METHODS = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD' },
  { label: 'Net Banking', value: 'NET_BANKING' },
];

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
  const [selectedContactId, setSelectedContactId] = useState('new');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
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
    setSelectedContactId('new');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
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

    const resolvedName =
      selectedContactId === 'new'
        ? contactName.trim()
        : contacts.find((c) => c.id === selectedContactId)?.name;

    if (!resolvedName) {
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
        contactName: resolvedName,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
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
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-emerald-800 animate-fadeIn">
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
              <option value="" className="bg-[#EAE6DF] text-charcoal">All Types</option>
              <option value="LENT" className="bg-[#EAE6DF] text-charcoal">Lent Only</option>
              <option value="BORROWED" className="bg-[#EAE6DF] text-charcoal">Borrowed Only</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal cursor-pointer"
            >
              <option value="" className="bg-[#EAE6DF] text-charcoal">All Statuses</option>
              <option value="PENDING" className="bg-[#EAE6DF] text-charcoal">Pending</option>
              <option value="PARTIAL" className="bg-[#EAE6DF] text-charcoal">Partial</option>
              <option value="SETTLED" className="bg-[#EAE6DF] text-charcoal">Settled</option>
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
              {loans.map((loan) => {
                const isLent = loan.type === 'LENT';
                const isFullySettled = loan.status === 'SETTLED';

                return (
                  <div
                    key={loan.id}
                    className="neu-card rounded-2xl p-5 space-y-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider neu-inset ${
                              isLent ? 'text-gain' : 'text-loss'
                            }`}
                          >
                            {isLent ? 'Lent to' : 'Borrowed from'}
                          </span>
                          <span className="text-[10px] font-semibold text-pencil">
                            {formatDate(loan.loanDate)}
                          </span>
                        </div>
                        <h4 className="text-base font-display font-semibold text-charcoal mt-1.5">
                          {loan.contactName}
                        </h4>
                        {loan.description && (
                          <p className="text-xs text-pencil mt-0.5">{loan.description}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-pencil block">Remaining</span>
                        <span className="text-base font-bold text-charcoal tabular-nums">
                          {formatCurrency(loan.remainingAmount)}
                        </span>
                        <span className="text-[10px] text-pencil block">
                          of {formatCurrency(loan.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-pencil">
                        <span>Principal: {formatCurrency(loan.amount)}</span>
                        <span>Settled: {loan.repaidPercentage}%</span>
                      </div>
                      <div className="neu-groove h-2 w-full p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFullySettled ? 'bg-gain' : 'bg-[#0047FF]'
                          }`}
                          style={{ width: `${Math.min(100, loan.repaidPercentage)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset ${
                          isFullySettled
                            ? 'text-gain'
                            : loan.status === 'PARTIAL'
                            ? 'text-[#0047FF]'
                            : 'text-pencil'
                        }`}
                      >
                        {loan.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openSettlementModal(loan)}
                          className="neu-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal cursor-pointer rounded-xl"
                        >
                          <History className="h-3.5 w-3.5 text-pencil" />
                          <span>{isFullySettled ? 'Audit Log' : 'Settle'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="neu-btn p-1.5 text-pencil hover:text-loss rounded-xl cursor-pointer"
                          title="Delete Loan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* CONTACTS DIRECTORY TAB */
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="neu-card p-12 text-center rounded-3xl space-y-3">
              <Users2 className="h-8 w-8 text-pencil mx-auto" />
              <h3 className="text-sm font-bold text-charcoal">NO CONTACTS DIRECTORY</h3>
              <p className="text-xs text-pencil max-w-xs mx-auto">
                Contacts are created automatically when logging new loans.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="neu-card p-4 rounded-2xl space-y-1">
                  <h4 className="text-xs font-bold text-charcoal">{contact.name}</h4>
                  {contact.email && (
                    <p className="text-[11px] text-pencil truncate">{contact.email}</p>
                  )}
                  {contact.phone && (
                    <p className="text-[11px] text-pencil font-mono">{contact.phone}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. RECORD LOAN MODAL */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#EAE6DF] neu-card p-6 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
                  Peer Ledger
                </span>
                <h3 className="text-lg font-display font-semibold text-charcoal">
                  Record Peer Loan
                </h3>
              </div>
              <button
                onClick={closeAddLoanModal}
                className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loanError && (
              <div className="mt-4 neu-inset p-3 text-xs font-semibold text-loss rounded-xl">
                {loanError}
              </div>
            )}

            <form onSubmit={handleSaveLoan} className="mt-4 space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
                  Classification *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLoanType('LENT')}
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                      loanType === 'LENT'
                        ? 'neu-inset text-gain font-bold'
                        : 'neu-btn text-pencil hover:text-charcoal'
                    }`}
                  >
                    I Lent (To Receive)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanType('BORROWED')}
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                      loanType === 'BORROWED'
                        ? 'neu-inset text-loss font-bold'
                        : 'neu-btn text-pencil hover:text-charcoal'
                    }`}
                  >
                    I Borrowed (To Pay)
                  </button>
                </div>
              </div>

              {/* Contact Selector / Input */}
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter contact name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-xs"
                />
              </div>

              {/* Principal Amount */}
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Principal Amount (INR ₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-sm font-bold font-numeric text-charcoal"
                />
              </div>

              {/* Date & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                    Loan Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={loanDate}
                    onChange={(e) => setLoanDate(e.target.value)}
                    className="neu-input block w-full py-2 px-3 text-xs cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="neu-input block w-full py-2 px-3 text-xs cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Notes / Context
                </label>
                <input
                  type="text"
                  placeholder="e.g. For concert tickets, Rent share"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddLoanModal}
                  className="neu-btn px-4 py-2.5 text-xs font-semibold text-pencil hover:text-charcoal cursor-pointer rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loanSaving}
                  className="neu-btn-blue px-5 py-2.5 text-xs font-semibold text-white cursor-pointer rounded-xl"
                >
                  {loanSaving ? 'Saving...' : 'Record Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. SETTLEMENT & AUDIT MODAL */}
      {isSettlementModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#EAE6DF] neu-card p-6 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
                  Debt Settlement
                </span>
                <h3 className="text-lg font-display font-semibold text-charcoal">
                  {selectedLoan.contactName}
                </h3>
              </div>
              <button
                onClick={closeSettlementModal}
                className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Remaining Balance Stat */}
            <div className="neu-card p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
                  Outstanding Balance
                </span>
                <span className="text-xl font-bold text-charcoal tabular-nums">
                  {formatCurrency(selectedLoan.remainingAmount)}
                </span>
              </div>
              <span className="text-xs font-semibold text-pencil">
                Principal: {formatCurrency(selectedLoan.amount)}
              </span>
            </div>

            {settleError && (
              <div className="neu-inset p-3 text-xs font-semibold text-loss rounded-xl">
                {settleError}
              </div>
            )}

            {/* Settle Form if not settled */}
            {selectedLoan.remainingAmount > 0 ? (
              <form onSubmit={handleRecordSettlement} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                    Repayment Amount (INR ₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    max={selectedLoan.remainingAmount}
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                    className="neu-input block w-full py-2.5 px-3 text-sm font-bold font-numeric text-charcoal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                      Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="neu-input block w-full py-2.5 px-3 text-xs cursor-pointer"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value} className="bg-[#EAE6DF] text-charcoal">
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={settlementDate}
                      onChange={(e) => setSettlementDate(e.target.value)}
                      className="neu-input block w-full py-2 px-3 text-xs cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Partial GPay transfer"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="neu-input block w-full py-2.5 px-3 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={settleSaving}
                  className="neu-btn-blue w-full py-3 text-xs font-semibold text-white cursor-pointer"
                >
                  {settleSaving ? 'Recording Settlement...' : 'Confirm Repayment'}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl neu-inset text-center text-xs font-bold text-gain">
                This debt obligation is fully settled.
              </div>
            )}

            {/* Audit History Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                Settlement Audit Trail
              </h4>
              {settlementHistory.length === 0 ? (
                <p className="text-xs text-pencil">No repayments logged yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto neu-inset p-3 rounded-2xl">
                  {settlementHistory.map((s) => (
                    <div key={s.id} className="py-1 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-charcoal tabular-nums">
                          {formatCurrency(s.amount)}
                        </span>
                        <span className="text-[10px] text-pencil block">
                          {s.paymentMethod.replace('_', ' ')} • {formatDate(s.settlementDate)}
                        </span>
                      </div>
                      {s.notes && <span className="text-[11px] text-pencil truncate">{s.notes}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
