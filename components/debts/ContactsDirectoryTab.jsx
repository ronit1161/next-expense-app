'use client';

import { Users, Mail, Phone } from 'lucide-react';

export default function ContactsDirectoryTab({ contacts = [] }) {
  if (contacts.length === 0) {
    return (
      <div className="fintech-card p-12 text-center space-y-3 rounded-3xl">
        <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
          <Users className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Contacts Directory
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Contacts are automatically indexed and saved when you record new peer loans.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact, idx) => {
        return (
          <div
            key={contact.id}
            className="fintech-card p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm shrink-0">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {contact.name}
                </h4>
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                  Contact #{idx + 1}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/5">
              {contact.email && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {!contact.email && !contact.phone && (
                <p className="text-xs text-slate-400 italic">
                  No additional contact details logged
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
