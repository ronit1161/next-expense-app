'use client';

import { Users2 } from 'lucide-react';

export default function ContactsDirectoryTab({ contacts = [] }) {
  if (contacts.length === 0) {
    return (
      <div className="border-4 border-black dark:border-white/20 p-12 text-center space-y-3 bg-[var(--bg-surface)]">
        <Users2 className="h-8 w-8 text-pencil mx-auto" />
        <h3 className="text-sm font-black uppercase text-charcoal">NO CONTACTS DIRECTORY</h3>
        <p className="text-xs font-mono text-pencil max-w-xs mx-auto uppercase">
          CONTACTS ARE INDEXED AUTOMATICALLY WHEN LOGGING NEW LOANS.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {contacts.map((contact, idx) => (
        <div key={contact.id} className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-4 space-y-1.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-1.5 mb-1.5">
              <span className="text-[9px] font-mono text-[#FF3000] font-black">[{idx + 1}]</span>
              <span className="text-[9px] font-mono text-pencil uppercase">CONTACT</span>
            </div>
            <h4 className="text-sm font-black uppercase text-charcoal">{contact.name}</h4>
            {contact.email && (
              <p className="text-[10px] font-mono text-pencil truncate uppercase">{contact.email}</p>
            )}
            {contact.phone && (
              <p className="text-[10px] font-mono text-pencil font-bold">{contact.phone}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
