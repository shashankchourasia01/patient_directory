
'use client';
import React from 'react';
import type { Patient } from '../types/patient';

type Props = { patient: Patient };

function initials(name?: string) {
  if (!name) return '--';
  return name.split(' ').slice(0,2).map(s => s[0]).join('').toUpperCase();
}

// map condition to small tag classes
const tagStyle = (cond?: string) => {
  if (!cond) return 'bg-gray-100 text-gray-800';
  const c = cond.toLowerCase();
  if (c.includes('fever')) return 'bg-red-100 text-red-700';
  if (c.includes('rash')) return 'bg-pink-100 text-pink-700';
  if (c.includes('sprain') || c.includes('sprained')) return 'bg-green-100 text-green-700';
  if (c.includes('headache')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-blue-100 text-blue-800';
};

export default function PatientCard({ patient }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
      <div className="p-3 flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
          {patient.image ? (
            <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span>{initials(patient.name)}</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">{patient.name || 'Unknown'}</div>
              <div className="text-xs text-slate-500">ID: {patient.id || '-'}</div>
            </div>
            <div>
              <div className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                Age: {patient.age ?? '-'}
              </div>
            </div>
          </div>

          <div className={`inline-block mt-2 px-2 py-1 text-xs rounded ${tagStyle(patient.condition)}`}>
            {patient.condition || 'N/A'}
          </div>

          <div className="mt-3 text-sm text-slate-600 space-y-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8 2 4 5.5 4 10c0 6 8 12 8 12s8-6 8-12c0-4.5-4-8-8-8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                <circle cx="12" cy="10" r="2.2" fill="currentColor" />
              </svg>
              <span>{patient.address || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
                <path d="M2 6.5C2 6.5 6 3 12 3s10 3.5 10 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17.5C2 17.5 6 21 12 21s10-3.5 10-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{patient.phone || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
                <path d="M3 8.5l9 6 9-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 6.5H3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{patient.email || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
