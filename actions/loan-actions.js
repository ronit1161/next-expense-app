'use server';

import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { loanSchema, settlementSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function getContactsAction() {
  try {
    const user = await requireAuth();
    const contacts = await prisma.contact.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    });
    return { success: true, contacts };
  } catch (error) {
    console.error('Failed to get contacts:', error);
    return { success: false, error: error.message || 'Failed to fetch contacts' };
  }
}

export async function getLoansAction({ type, status } = {}) {
  try {
    const user = await requireAuth();

    const where = {
      userId: user.id,
    };

    if (type) where.type = type;
    if (status) where.status = status;

    const [loans, debtAggs] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          contact: true,
        },
        orderBy: [{ loanDate: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.loan.findMany({
        where: {
          userId: user.id,
          status: { not: 'SETTLED' },
        },
        select: {
          type: true,
          remainingAmount: true,
        },
      }),
    ]);

    let totalReceivable = 0;
    let totalPayable = 0;
    debtAggs.forEach((d) => {
      const rem = Number(d.remainingAmount) || 0;
      if (d.type === 'LENT') {
        totalReceivable += rem;
      } else if (d.type === 'BORROWED') {
        totalPayable += rem;
      }
    });

    const formattedLoans = loans.map((l) => ({
      id: l.id,
      type: l.type,
      amount: Number(l.amount),
      remainingAmount: Number(l.remainingAmount),
      description: l.description,
      status: l.status,
      loanDate: l.loanDate.toISOString().split('T')[0],
      dueDate: l.dueDate ? l.dueDate.toISOString().split('T')[0] : null,
      contactId: l.contactId,
      contactName: l.contact.name,
      contactEmail: l.contact.email,
      contactPhone: l.contact.phone,
    }));

    return {
      success: true,
      loans: formattedLoans,
      summary: {
        totalReceivable,
        totalPayable,
      },
    };
  } catch (error) {
    console.error('Failed to get loans:', error);
    return { success: false, error: error.message || 'Failed to fetch loans' };
  }
}

export async function getLoanDetailsAction(id) {
  try {
    const user = await requireAuth();

    const loan = await prisma.loan.findFirst({
      where: { id, userId: user.id },
      include: {
        contact: true,
        settlements: {
          orderBy: [{ settlementDate: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!loan) {
      return { success: false, error: 'Loan record not found or access denied.' };
    }

    return {
      success: true,
      loan: {
        id: loan.id,
        type: loan.type,
        amount: Number(loan.amount),
        remainingAmount: Number(loan.remainingAmount),
        description: loan.description,
        status: loan.status,
        loanDate: loan.loanDate.toISOString().split('T')[0],
        dueDate: loan.dueDate ? loan.dueDate.toISOString().split('T')[0] : null,
        contactId: loan.contactId,
        contactName: loan.contact.name,
      },
      settlements: loan.settlements.map((s) => ({
        id: s.id,
        amount: Number(s.amount),
        paymentMethod: s.paymentMethod,
        settlementDate: s.settlementDate.toISOString().split('T')[0],
        notes: s.notes,
      })),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createLoanAction(data) {
  try {
    const user = await requireAuth();
    const validated = loanSchema.parse(data);

    // Resolve contact: find existing by name for this user or create
    let contact = await prisma.contact.findFirst({
      where: {
        userId: user.id,
        name: validated.contactName.trim(),
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          userId: user.id,
          name: validated.contactName.trim(),
          email: validated.contactEmail || null,
          phone: validated.contactPhone || null,
        },
      });
    }

    const loan = await prisma.loan.create({
      data: {
        userId: user.id,
        contactId: contact.id,
        type: validated.type,
        amount: validated.amount,
        remainingAmount: validated.amount,
        description: validated.description || null,
        loanDate: new Date(validated.loanDate),
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        status: 'PENDING',
      },
      include: {
        contact: true,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/debts');
    revalidatePath('/reports');

    return {
      success: true,
      loan: {
        id: loan.id,
        type: loan.type,
        amount: Number(loan.amount),
        remainingAmount: Number(loan.remainingAmount),
        description: loan.description,
        status: loan.status,
        loanDate: loan.loanDate.toISOString().split('T')[0],
        dueDate: loan.dueDate ? loan.dueDate.toISOString().split('T')[0] : null,
        contactId: loan.contactId,
        contactName: loan.contact.name,
      },
    };
  } catch (error) {
    console.error('Create loan error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to create loan record',
    };
  }
}

export async function recordSettlementAction(loanId, data) {
  try {
    const user = await requireAuth();
    const validated = settlementSchema.parse(data);

    const result = await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findFirst({
        where: { id: loanId, userId: user.id },
      });

      if (!loan) {
        throw new Error('Loan record not found or access denied.');
      }

      const currentRemaining = Number(loan.remainingAmount);
      const settleAmount = Number(validated.amount);

      if (settleAmount > currentRemaining) {
        throw new Error(`Settlement amount exceeds remaining debt (₹${currentRemaining}).`);
      }

      const settlement = await tx.loanSettlement.create({
        data: {
          loanId: loan.id,
          amount: validated.amount,
          paymentMethod: validated.paymentMethod,
          settlementDate: new Date(validated.settlementDate),
          notes: validated.notes || null,
        },
      });

      const newRemaining = Number((currentRemaining - settleAmount).toFixed(2));
      const newStatus = newRemaining <= 0 ? 'SETTLED' : 'PARTIAL';

      await tx.loan.update({
        where: { id: loan.id },
        data: {
          remainingAmount: newRemaining,
          status: newStatus,
        },
      });

      return {
        settlementId: settlement.id,
        remainingAmount: newRemaining,
        status: newStatus,
      };
    });

    revalidatePath('/dashboard');
    revalidatePath('/debts');
    revalidatePath('/reports');

    return { success: true, data: result };
  } catch (error) {
    console.error('Record settlement error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to record settlement',
    };
  }
}

export async function deleteLoanAction(id) {
  try {
    const user = await requireAuth();

    const existing = await prisma.loan.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: 'Loan record not found or access denied.' };
    }

    await prisma.loan.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/debts');
    revalidatePath('/reports');

    return { success: true };
  } catch (error) {
    console.error('Delete loan error:', error);
    return { success: false, error: error.message || 'Failed to delete loan' };
  }
}
