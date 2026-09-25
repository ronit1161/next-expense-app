'use client';

import { Users, Mail, Phone, UserCircle } from 'lucide-react';

export default function ContactsDirectoryTab({ contacts = [] }) {
  if (contacts.length === 0) {
    return (
      <div className="clay-card p-12 text-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-violet-100 dark:bg-violet-900/30 clay-orb flex items-center justify-center text-violet-500 mx-auto">
          <Users className="h-8 w-8" />
        </div>
        <h3
          className="text-base font-bold text-[var(--text-primary)]"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          No Contacts Directory
        </h3>
        <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
          Contacts are automatically indexed and saved when you record new peer loans.
        </p>
      </div>
    );
  }

  // Predefined candy gradient pairs for avatars
  const avatarGradients = [
    'from-violet-400 to-purple-600',
    'from-pink-400 to-rose-600',
    'from-sky-400 to-blue-600',
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-600',
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {contacts.map((contact, idx) => {
        const grad = avatarGradients[idx % avatarGradients.length];
        return (
          <div
            key={contact.id}
            className="clay-card p-6 rounded-[28px] space-y-4 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${grad} clay-orb flex items-center justify-center text-white font-extrabold text-base shrink-0`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  className="text-base font-extrabold text-[var(--text-primary)] truncate"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {contact.name}
                </h4>
                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
                  Contact #{idx + 1}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--clay-border)]">
              {contact.email && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Mail className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {!contact.email && !contact.phone && (
                <p className="text-xs text-[var(--text-muted)] italic">
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
