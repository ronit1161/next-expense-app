'use client';

import { Users2 } from 'lucide-react';

export default function ContactsDirectoryTab({ contacts = [] }) {
  if (contacts.length === 0) {
    return (
      <div className="neu-card p-12 text-center rounded-3xl space-y-3">
        <Users2 className="h-8 w-8 text-pencil mx-auto" />
        <h3 className="text-sm font-bold text-charcoal">NO CONTACTS DIRECTORY</h3>
        <p className="text-xs text-pencil max-w-xs mx-auto">
          Contacts are created automatically when logging new loans.
        </p>
      </div>
    );
  }

  return (
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
  );
}
